#!/usr/bin/env python3
"""Check TOML syntax and the dated public Codex schema, never runtime operation.

Requires Python 3.11+ and jsonschema. No downloads, config writes, or Codex runs.
The agent envelope (name/description) is documented separately from config.toml.
"""
import argparse
import copy
import hashlib
import json
import pathlib
import shutil
import tomllib

from jsonschema import Draft7Validator

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "scripts/schemas/codex-config-2026-10-09.json"
SCHEMA_SHA256 = "7933a70506e753a6e98c16800d2a76770b2af2b7295491f8f0b8e713e952027e"
SOURCES = {
    "config": "https://developers.openai.com/codex/config-schema.json",
    "agents": "https://learn.chatgpt.com/docs/agent-configuration/subagents",
    "aliases": "https://learn.chatgpt.com/docs/config-file/config-reference",
}


def load_schema():
    raw = SCHEMA_PATH.read_bytes()
    if hashlib.sha256(raw).hexdigest() != SCHEMA_SHA256:
        raise ValueError("Official schema snapshot hash changed; review its source first")
    schema = json.loads(raw)
    Draft7Validator.check_schema(schema)
    return schema


def normalize_aliases(data):
    """Validate the documented legacy alias without rewriting the user's TOML."""
    result = copy.deepcopy(data)
    agents = result.get("agents")
    if isinstance(agents, dict) and "max_threads" in agents:
        if "max_concurrent_threads_per_session" in agents:
            raise ValueError("Both max_threads and its canonical alias are declared")
        agents["max_concurrent_threads_per_session"] = agents.pop("max_threads")
    return result


def schema_errors(data, kind, schema):
    candidate = copy.deepcopy(schema)
    if kind == "standalone-agent":
        # name/description are agent identity fields, not general config keys.
        candidate["properties"].update({
            "name": {"type": "string", "minLength": 1, "pattern": r"^\S+$"},
            "description": {"type": "string", "minLength": 1},
        })
        candidate["required"] = ["name", "description", "developer_instructions"]
        candidate["properties"]["developer_instructions"] = {"type": "string", "minLength": 1}
    try:
        normalized = normalize_aliases(data)
    except ValueError as exc:
        return [str(exc)]
    return [f"{'.'.join(map(str, err.absolute_path)) or '<root>'}: {err.message}"
            for err in sorted(Draft7Validator(candidate).iter_errors(normalized), key=lambda err: str(err.path))]


def audit(root, schema):
    root = pathlib.Path(root).resolve()
    rows, errors, warnings = [], [], []
    config_path = root / ".codex/config.toml"
    parsed = {}
    # Inventories are project-only. Historical Kiro files receive syntax checks only.
    for path in sorted(root.rglob("*.toml")):
        if any(part in {".git", "node_modules"} for part in path.relative_to(root).parts):
            continue
        rel = path.relative_to(root).as_posix()
        try:
            parsed[rel] = tomllib.loads(path.read_text())
        except (tomllib.TOMLDecodeError, UnicodeError) as exc:
            errors.append(f"{rel}: syntax: {exc}")
            rows.append({"path": rel, "kind": "unparsed", "syntax": "FAIL", "schema": "NOT_CHECKED"})
    roles = parsed.get(".codex/config.toml", {}).get("agents", {})
    layers = set()
    if isinstance(roles, dict):
        for name, role in roles.items():
            if not isinstance(role, dict) or "config_file" not in role:
                continue
            value = role["config_file"]
            if not isinstance(value, str):
                continue  # Schema validation below supplies the type error.
            target = (config_path.parent / value).resolve()
            if not target.is_relative_to(root):
                warnings.append(f"Role {name}: config_file outside project, not inspected")
                continue
            rel = target.relative_to(root).as_posix()
            layers.add(rel)
            if not target.is_file():
                errors.append(f"Role {name}: missing config_file {value}")
    names = {}
    for rel, data in parsed.items():
        if rel.startswith(".kiro/"):
            kind = "historical-source"
        elif rel == ".codex/config.toml":
            kind = "project-config"
        elif rel in layers and not {"name", "description"} <= data.keys():
            kind = "role-config-layer"
        elif rel.startswith(".codex/agents/") or rel.startswith(".agents/skills/impeccable/agents/"):
            kind = "standalone-agent"
        elif rel in layers:
            kind = "standalone-agent"
        else:
            kind = "other-toml"
        issues = schema_errors(data, kind, schema) if kind in {"project-config", "role-config-layer", "standalone-agent"} else []
        errors.extend(f"{rel}: schema: {issue}" for issue in issues)
        row = {"path": rel, "kind": kind, "syntax": "PASS",
               "schema": "FAIL" if issues else "PASS" if kind in {"project-config", "role-config-layer", "standalone-agent"} else "NOT_APPLICABLE"}
        if kind == "standalone-agent":
            row["name"] = data.get("name")
            row["declared_settings"] = {k: v for k, v in data.items() if k not in {"name", "description", "developer_instructions"}}
            name = data.get("name")
            if isinstance(name, str) and rel.startswith(".codex/agents/"):
                if name in names:
                    errors.append(f"Duplicate discovered agent name {name}: {names[name]} and {rel}")
                names[name] = rel
        rows.append(row)
    # The skill helper directory is a distributed mirror, not another discovery root.
    for path in (root / ".agents/skills/impeccable/agents").glob("*.toml"):
        a = path.relative_to(root).as_posix()
        b = ".codex/agents/" + path.name
        if b in parsed and parsed.get(a) != parsed[b]:
            errors.append(f"Helper mirror drift: {a} vs {b}")
    if not config_path.exists():
        warnings.append(".codex/config.toml absent: project effective settings not declared")
    else:
        for key in {"model_provider", "model_providers", "openai_base_url", "chatgpt_base_url", "notify", "profile", "profiles", "otel", "apps_mcp_product_sku", "experimental_realtime_ws_base_url"} & parsed.get(".codex/config.toml", {}).keys():
            warnings.append(f"Project config {key}: documented as ignored at project scope")
    return {"schema_snapshot_sha256": SCHEMA_SHA256, "sources": SOURCES, "files": rows,
            "project_config_present": config_path.exists(), "errors": errors, "warnings": warnings,
            "codex_executable_available": shutil.which("codex") is not None,
            "project_codex_version": "NOT_DETERMINED_BY_STATIC_VALIDATOR", "runtime_loading": "NOT_VERIFIED",
            "execution": "NOT_VERIFIED"}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=str(ROOT))
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    report = audit(args.root, load_schema())
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        for row in report["files"]:
            print(f"{row['path']}: {row['kind']}; syntax={row['syntax']}; schema={row['schema']}")
        for message in report["warnings"]:
            print("NOTE:", message)
        for message in report["errors"]:
            print("FAIL:", message)
        print("Runtime loading/execution: NOT_VERIFIED")
    raise SystemExit(bool(report["errors"]))
