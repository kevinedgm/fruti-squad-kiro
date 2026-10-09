"""Regression checks for schema classification; these do not run Codex agents."""
import importlib.util
import pathlib
import subprocess
import tempfile
import tomllib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("codex_toml", ROOT / "scripts/validate-codex-toml.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class CodexTomlTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.schema = module.load_schema()

    def agent(self, **extra):
        return {"name": "reviewer", "description": "Review evidence only", "developer_instructions": "Read the current contract", **extra}

    def test_identity_envelope_is_not_general_config(self):
        data = self.agent(model_reasoning_effort="high")
        self.assertFalse(module.schema_errors(data, "standalone-agent", self.schema))
        self.assertTrue(module.schema_errors(data, "project-config", self.schema))

    def test_nicknames_belong_to_role_declaration_not_agent_root(self):
        self.assertTrue(module.schema_errors(self.agent(nickname_candidates=["eye"]), "standalone-agent", self.schema))
        config = {"agents": {"reviewer": {"description": "Review", "config_file": "agents/reviewer.toml", "nickname_candidates": ["eye"]}}}
        self.assertFalse(module.schema_errors(config, "project-config", self.schema))

    def test_unknown_wrong_type_and_misplaced_keys_fail(self):
        for data in [self.agent(workflow="review"), self.agent(model=42), self.agent(model_reasoning_effort=42), self.agent(skills={"enabled": True})]:
            with self.subTest(data=data):
                self.assertTrue(module.schema_errors(data, "standalone-agent", self.schema))

    def test_effort_string_requires_runtime_model_confirmation(self):
        # The schema permits advertised model values, rather than a closed enum.
        self.assertFalse(module.schema_errors(self.agent(model_reasoning_effort="unlimited"), "standalone-agent", self.schema))

    def test_documented_legacy_alias_is_accepted_without_rewrite(self):
        data = {"agents": {"max_threads": 3}}
        self.assertFalse(module.schema_errors(data, "project-config", self.schema))
        self.assertEqual(data, {"agents": {"max_threads": 3}})
        self.assertTrue(module.schema_errors({"agents": {"max_threads": 3, "max_concurrent_threads_per_session": 4}}, "project-config", self.schema))

    def test_duplicate_toml_keys_and_agent_names_fail(self):
        with tempfile.TemporaryDirectory() as directory:
            root = pathlib.Path(directory)
            agents = root / ".codex/agents"
            agents.mkdir(parents=True)
            valid = 'name="same"\ndescription="Review"\ndeveloper_instructions="Inspect"\n'
            (agents / "a.toml").write_text(valid)
            (agents / "b.toml").write_text(valid)
            (agents / "broken.toml").write_text('name="one"\nname="two"\n')
            report = module.audit(root, self.schema)
            self.assertTrue(any("syntax" in error for error in report["errors"]))
            self.assertTrue(any("Duplicate discovered agent" in error for error in report["errors"]))

    def test_legacy_role_layer_is_not_migrated_to_standalone(self):
        with tempfile.TemporaryDirectory() as directory:
            root = pathlib.Path(directory)
            (root / ".codex/roles").mkdir(parents=True)
            (root / ".codex/config.toml").write_text('[agents.reviewer]\ndescription="Review"\nconfig_file="roles/reviewer.toml"\n')
            layer = root / ".codex/roles/reviewer.toml"
            source = 'developer_instructions="Inspect evidence"\nmodel_reasoning_effort="high"\n'
            layer.write_text(source)
            report = module.audit(root, self.schema)
            self.assertFalse(report["errors"])
            row = next(row for row in report["files"] if row["path"].endswith("roles/reviewer.toml"))
            self.assertEqual(row["kind"], "role-config-layer")
            self.assertEqual(layer.read_text(), source)

    def test_multiline_instructions_preserve_source_characters(self):
        text = "Read C:\\project\\file; preserve 'quoted' text, \"double\", ñ and\nMarkdown."
        data = tomllib.loads("developer_instructions = '''\n" + text + "'''\n")
        self.assertEqual(data["developer_instructions"], text)

    def test_project_inventory_does_not_claim_runtime_loading(self):
        report = module.audit(ROOT, self.schema)
        self.assertFalse(report["errors"])
        self.assertEqual(report["runtime_loading"], "NOT_VERIFIED")
        self.assertEqual(report["execution"], "NOT_VERIFIED")
        self.assertEqual(sum(row["path"].startswith(".codex/agents/") for row in report["files"]), 10)

    def test_resource_update_preserves_identity_and_nonresource_settings(self):
        baseline = "d0b2ad83f4af0d2acaa16ddbd8e1df17e02ee347"
        for path in sorted((ROOT / ".codex/agents").glob("*.toml")):
            relative = path.relative_to(ROOT).as_posix()
            old = tomllib.loads(subprocess.check_output(["git", "show", baseline + ":" + relative], cwd=ROOT).decode())
            new = tomllib.loads(path.read_text())
            excluded = {"model", "model_reasoning_effort", "developer_instructions"}
            with self.subTest(path=relative):
                self.assertEqual({k:v for k,v in old.items() if k not in excluded}, {k:v for k,v in new.items() if k not in excluded})
                self.assertIn(old["developer_instructions"], new["developer_instructions"].replace("6. Lee .codex/qa/orchestration.md cuando participes en un encargo completo Fruti; finalizar esta subtarea no termina el objetivo del coordinador.\n\n", "").replace("- Lee .codex/qa/model-routing.md antes de seleccionar recursos, cambiar de operación o escalar. Sus condiciones no amplían este rol; confirma el mecanismo y configuración efectiva, no un cambio supuesto desde la prosa.\n", "").replace("0. Lee .codex/qa/model-routing.md al seleccionar recursos o escalar. Un override textual no cambia el modelo; conserva este output y alcance al transferir evidencia al mismo dueño.\n", ""))


if __name__ == "__main__":
    unittest.main()
