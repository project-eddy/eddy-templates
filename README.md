# Eddy Core Templates

Curated workflow templates available to all Eddy users from the "New Workflow" form. Each template is a standard `EddyWorkflowExportT` JSON file — the same format produced by the export feature in the Eddy app.

## Repo Structure

```
eddy-templates/
  manifest.json              # Auto-generated index (do not edit by hand)
  scripts/
    build-manifest.js        # Generates manifest.json from template files
  templates/
    simple-onboarding.json   # Template: Simple Onboarding
```

## Adding a Template

1. Export a workflow from Eddy using the export feature
2. Place the exported JSON file in `templates/` (filename becomes the slug, e.g. `my-template.json` → `my-template`)
3. Ensure the workflow JSON has `name` and `description` fields set
4. Run the build script: `node scripts/build-manifest.js`
5. Commit both the template file and the updated `manifest.json`

## Build Script

The build script auto-generates `manifest.json` by scanning `templates/` for JSON files. It extracts:

- **slug** from the filename
- **name** and **description** from the workflow data
- **preview** data (pages, transitions, orientation) for rendering `WorkflowMiniGraph` in the UI

Run it after any template change:

```bash
node scripts/build-manifest.js
```

## How It Works

The Eddy API fetches `manifest.json` to list available templates and individual template JSON files when a user selects one. Templates are imported into the user's workspace using the existing workflow import service. See `app/plans/core-templates-system.md` for the full architecture.
