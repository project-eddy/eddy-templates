#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.resolve(__dirname, "..", "templates");
const MANIFEST_PATH = path.resolve(__dirname, "..", "manifest.json");
const SCHEMA_VERSION = 1;

function extractPreview(workflow) {
  const pages = (workflow.pages || []).map((p) => ({
    id: p.id,
    name: p.title,
    position: p.node?.position ?? { x: 0, y: 0 },
    is_start_stage: !!p.is_starting,
    is_end_stage: !!p.is_end,
  }));

  const pageTransitions = (workflow.pageTransitions || []).map((t) => ({
    source_id: t.source_id,
    target_id: t.target_id,
  }));

  const orientation = workflow.workflow?.style?.orientation ?? "vertical";

  return { pages, pageTransitions, orientation };
}

function buildManifest() {
  const files = fs
    .readdirSync(TEMPLATES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const templates = files.map((filename) => {
    const slug = path.basename(filename, ".json");
    const raw = fs.readFileSync(path.join(TEMPLATES_DIR, filename), "utf-8");
    const data = JSON.parse(raw);

    const name = data.workflow?.name ?? slug;
    const description = data.workflow?.description ?? "";
    const preview = extractPreview(data);

    return {
      slug,
      schemaVersion: SCHEMA_VERSION,
      name,
      description,
      file: `templates/${filename}`,
      preview,
    };
  });

  templates.sort((a, b) => a.name.localeCompare(b.name));

  const manifest = {
    version: 1,
    templates,
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `Built manifest.json with ${templates.length} template(s): ${templates.map((t) => t.slug).join(", ")}`
  );
}

buildManifest();
