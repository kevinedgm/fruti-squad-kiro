#!/usr/bin/env python3
"""Read-only Fruti icon audit. --root selects a project, not a Codex session.
Requires PyYAML. Paths resolve from the skill directory, not agents/.
"""
import argparse
import hashlib
import json
import math
import pathlib
import re
import struct
import zlib
import xml.etree.ElementTree as ET
import yaml


class UniqueLoader(yaml.SafeLoader):
    pass


def unique_mapping(loader, node, deep=False):
    mapping = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if key in mapping:
            raise ValueError(f'Duplicate YAML key: {key}')
        mapping[key] = loader.construct_object(value_node, deep=deep)
    return mapping


UniqueLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)
SOURCE = pathlib.Path(__file__).resolve().parents[1]
NAMES = sorted(p.parent.name for p in (SOURCE / '.agents/skills').glob('*/SKILL.md'))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def audit(root):
    rows = []
    for name in NAMES:
        skill = root / '.agents/skills' / name
        metadata = skill / 'agents/openai.yaml'
        row = {'skill': name, 'copy': str(skill.resolve()), 'symlink': skill.is_symlink(),
               'errors': [], 'stale_files': [], 'icons': {}, 'desktop': 'not_verified'}
        try:
            assert (skill / 'SKILL.md').is_file(), 'Missing SKILL.md'
            interface = yaml.load(metadata.read_text(), Loader=UniqueLoader)['interface']
            assert isinstance(interface, dict), 'interface must be a mapping'
            for key in ['display_name', 'short_description', 'icon_small', 'icon_large']:
                assert isinstance(interface.get(key), str) and interface[key].strip(), f'Missing/invalid {key}'
            assert 25 <= len(interface['short_description']) <= 64, 'Invalid short_description length'
            if 'brand_color' in interface:
                assert isinstance(interface['brand_color'], str) and re.fullmatch(r'#[0-9a-fA-F]{6}', interface['brand_color']), 'Invalid brand_color'
            row['metadata_sha256'] = sha(metadata)
            expected = yaml.load((SOURCE / '.agents/skills' / name / 'agents/openai.yaml').read_text(), Loader=UniqueLoader)['interface']
            if any(interface.get(key) != expected.get(key) for key in ['display_name', 'short_description', 'icon_small', 'icon_large', 'brand_color']):
                row['stale_files'].append('agents/openai.yaml')
            for key in ['icon_small', 'icon_large']:
                relative = pathlib.Path(interface[key])
                assert not relative.is_absolute() and '..' not in relative.parts and relative.parts[0] == 'assets', f'Non-local {key}'
                image = skill / relative
                assert image.resolve().is_relative_to(skill.resolve()), f'Asset escapes skill: {key}'
                assert image.is_file() and image.stat().st_size, f'Missing/empty {key}'
                if image.suffix == '.png':
                    assert name == 'fruti-squad' and key == 'icon_small', f'Unexpected PNG test: {key}'
                    data = image.read_bytes()
                    assert data[:8] == b'\x89PNG\r\n\x1a\n', 'Invalid PNG signature'
                    offset, chunks, compressed = 8, [], b''
                    while offset < len(data):
                        assert offset + 12 <= len(data), 'Truncated PNG chunk'
                        length = struct.unpack('>I', data[offset:offset+4])[0]
                        kind = data[offset+4:offset+8]
                        end = offset + 12 + length
                        assert end <= len(data), 'Truncated PNG data'
                        body = data[offset+8:offset+8+length]
                        crc = struct.unpack('>I', data[offset+8+length:end])[0]
                        assert zlib.crc32(kind + body) & 0xffffffff == crc, 'Invalid PNG CRC'
                        chunks.append(kind)
                        if kind == b'IHDR':
                            assert len(body) == 13, 'Invalid PNG IHDR'
                            width, height, depth, color, compression, filtering, interlace = struct.unpack('>IIBBBBB', body)
                            assert (width, height, depth) == (96, 96, 8), 'Invalid PNG dimensions/depth'
                            assert color in (2, 6) and (compression, filtering, interlace) == (0, 0, 0), 'Unexpected PNG encoding'
                        if kind == b'IDAT': compressed += body
                        offset = end
                        if kind == b'IEND': break
                    assert chunks[0] == b'IHDR' and chunks[-1] == b'IEND' and offset == len(data), 'Incomplete PNG'
                    pixels = zlib.decompress(compressed)
                    assert len(pixels) == height * (1 + width * (4 if color == 6 else 3)), 'Invalid PNG pixel stream'
                    canonical = SOURCE / '.agents/skills' / name / relative
                    if not canonical.is_file() or sha(image) != sha(canonical):
                        row['stale_files'].append(relative.as_posix())
                    row['icons'][key] = {'path': str(image.resolve()), 'sha256': sha(image), 'dimensions': [width, height], 'bytes': image.stat().st_size}
                    continue
                # Package-specific format check, not a whitelist for all Codex clients.
                assert image.suffix == '.svg', f'Unexpected package format: {key}'
                svg = ET.fromstring(image.read_bytes())
                assert svg.tag == '{http://www.w3.org/2000/svg}svg', f'Not SVG content: {key}'
                box = [float(v) for v in re.split(r'[ ,]+', svg.attrib.get('viewBox', '').strip())]
                assert len(box) == 4 and all(math.isfinite(v) for v in box) and box[2] > 0 and box[3] > 0, f'Invalid viewBox: {key}'
                text = image.read_text()
                assert not re.search(r'@import|@font-face|<script\b|<foreignObject\b|<!DOCTYPE|<!ENTITY', text, re.I), f'Non-portable SVG: {key}'
                for element in svg.iter():
                    assert element.tag.rsplit('}', 1)[-1] not in ['image', 'text'], f'Image/font dependency: {key}'
                    for attribute, value in element.attrib.items():
                        if attribute.rsplit('}', 1)[-1] == 'href':
                            assert value.startswith('#'), f'External href: {key}'
                assert 'url(' not in text, f'CSS resource requires manual review: {key}'
                canonical = SOURCE / '.agents/skills' / name / relative
                if not canonical.is_file() or sha(image) != sha(canonical):
                    row['stale_files'].append(relative.as_posix())
                row['icons'][key] = {'path': str(image.resolve()), 'sha256': sha(image), 'viewBox': box, 'bytes': image.stat().st_size}
        except (AssertionError, OSError, ValueError, KeyError, TypeError, ET.ParseError, yaml.YAMLError) as error:
            row['errors'].append(str(error))
        row['status'] = 'FAIL' if row['errors'] else 'DIFFERS_FROM_SOURCE' if row['stale_files'] else 'FILES_VALID'
        rows.append(row)
    return {'project': str(root.resolve()), 'scope': 'filesystem_only_not_Codex_discovery', 'skills': rows}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=pathlib.Path, default=SOURCE)
    result = audit(parser.parse_args().root.resolve())
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(1 if any(row['status'] != 'FILES_VALID' for row in result['skills']) else 0)
