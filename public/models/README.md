# Model Asset Library

Use this folder for web preview models used by the aquarium editor.

Recommended file per model:

- `model.glb` for the web editor preview.
- `print.stl` or `print.3mf` only when you need print handoff.
- Optional texture files only if they are not embedded into the GLB.

Model authoring rules:

- Export web preview assets as GLB.
- Put the model origin at the bottom center.
- Keep real-world scale consistent with the editor tank dimensions.
- Keep one model under 1-5 MB when possible.
- Prefer simple material slots if the editor needs color/material replacement.

Folder naming uses stable English slugs. Chinese display names and expected paths are listed in `manifest.json`.
