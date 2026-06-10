# APP INTEGRATION CHECKLIST — Pre-Integration QA for Live App
**Version:** 2.0  
**Package:** packages/shared  
**Run this checklist before any content goes live in the CORTEX-SHELL app**

---

## OVERVIEW

This checklist is the final gate before new content (lecture modules or exam sets) is considered integrated into the live app. It covers all layers from data files to runtime registry to surface rendering.

Run this checklist for:
- Every new exam set being published for the first time
- Every new lecture module being published for the first time
- Every update to an existing module or exam set (full re-run required)
- After any modification to `content_index.kimi.json` or `visual_asset_manifest.generated.json`

Items marked **CRITICAL** are blocking — the content must not go live until these pass. Items marked **WARNING** are non-blocking but must be documented.

---

## SECTION 1 — content_index.kimi.json

### 1.1 CRITICAL — JSON syntax is valid

Parse the entire `content_index.kimi.json` file. It must parse without errors.

Common failure causes: trailing comma after the last item in an array or object, unescaped characters, missing brackets.

### 1.2 CRITICAL — New content is registered

Verify the new module or exam set has an entry in the registry:
- New lecture module: entry exists in the relevant domain's `modules[]` array
- New exam set: entry exists in `examSets[]`

### 1.3 CRITICAL — Counters are accurate

Recalculate from scratch:
- [ ] `lectureModuleCount` == total module entries across all domains
- [ ] `examSetCount` == `examSets[].length`
- [ ] `examQuestionCount` == sum of all `examSets[].questionCount`
- [ ] Each domain's `moduleCount` == `modules[].length` for that domain

### 1.4 CRITICAL — sourceFile paths are correct and files exist

For every `sourceFile` entry:
- [ ] Path is relative to project root (no leading slash, no `./`)
- [ ] The file exists at that path on disk
- [ ] The file is parseable JSON

### 1.5 CRITICAL — No duplicate IDs

- [ ] No two modules share the same `id`
- [ ] No two exam sets share the same `id`
- [ ] No module `id` collides with any exam set `id`

### 1.6 WARNING — generatedAt is today's date

The `generatedAt` field should reflect the most recent update date. If it is more than 3 days old, it may indicate the file was not updated after the last edit.

### 1.7 WARNING — All entries have status set

Every module and exam set entry should have a `status` field. Default to `"active"` for published content.

---

## SECTION 2 — module.json Validity (Lecture Modules)

### 2.1 CRITICAL — module.json is valid JSON

The `module.json` at the registered `sourceFile` path must parse without errors.

### 2.2 CRITICAL — Required top-level fields present

Verify:
- [ ] `id` — matches the module ID in `content_index.kimi.json`
- [ ] `title` — non-empty string
- [ ] `sections[]` — non-empty array
- [ ] `glossary[]` — array (may be empty for modules without glossary terms)

### 2.3 CRITICAL — sectionCount matches sections array length

If `sectionCount` is declared in the module metadata, it must equal `sections[].length`.

### 2.4 WARNING — Sections have complete content

Spot-check 3–5 sections. Each section should have:
- A `title` (non-empty)
- A content field with substantive text (not empty, not placeholder text like "TODO" or "Lorem ipsum")
- A `sectionId` that is unique within the file

### 2.5 WARNING — wordCount is reasonable

If `wordCount` is declared, verify it is non-zero and plausible given the number of sections. A 10-section module with `wordCount: 50` indicates a likely error.

---

## SECTION 3 — exam_set.json Validity (Exam Sets)

### 3.1 CRITICAL — exam_set.json is valid JSON

The `exam_set.json` at the registered `sourceFile` path must parse without errors.

### 3.2 CRITICAL — Required fields present

Verify all required fields per `SCHEMA_EXAM_JSON_REFERENCE.md` are present and valid:
- [ ] `exam_id` matches registry entry
- [ ] `type` is `"asli"` or `"ai_generated"`
- [ ] `questions[]` is non-empty
- [ ] `metadata.total_questions` == `questions[].length`

### 3.3 CRITICAL — All validation checks passed

Verify that `OUTPUT_VALIDATION_CHECKLIST.md` was run on this file. Check that:
- [ ] `metadata.validation_flags[]` exists (even if empty)
- [ ] No critical failures are listed in `validation_flags`

### 3.4 WARNING — questionCount in registry matches file

The `questionCount` in `content_index.kimi.json` must match `metadata.total_questions` in the `exam_set.json` file.

---

## SECTION 4 — Visual Asset Manifest

### 4.1 CRITICAL — visual_asset_manifest.generated.json is valid JSON

Parse the manifest file. Must parse without errors.

### 4.2 CRITICAL — No duplicate asset IDs

Verify no two entries in `assets[]` share the same `id`. See `VISUAL_ASSET_MANIFEST_GUIDE.md` for the uniqueness check procedure.

### 4.3 CRITICAL — totalAssets matches assets array length

`totalAssets` must equal `assets[].length`.

### 4.4 CRITICAL — All visual_refs in module.json are registered

For each `visual_ref` ID used in any section of the new module, verify that a matching `id` exists in the manifest's `assets[]` array.

Broken reference = `visual_ref` ID in module.json that has no matching asset entry in the manifest.

Resolution for broken references: Add a placeholder entry to the manifest before going live.

### 4.5 WARNING — All new assets have required fields

For each newly added asset:
- [ ] `id` follows naming convention
- [ ] `type` is from the allowed type list
- [ ] `alt` text is at least 15 words
- [ ] `placeholderColor` is a valid hex color
- [ ] `placeholderIcon` is set

### 4.6 WARNING — generatedAt is current

Update `generatedAt` to today's date after any modification.

---

## SECTION 5 — Glossary and Cross-References

### 5.1 WARNING — All glossary_refs resolve in module.glossary[]

For any `glossary_ref` term used in section content, a matching entry must exist in the module's `glossary[]` array. Run the cross-check from `COMPILE_AUDIT_GUIDE.md` Section B.3.

### 5.2 WARNING — Glossary terms use standard Indonesian medical terminology

Spot-check 5–10 glossary entries. Terms should use accepted Indonesian medical terminology (KBBI medical terms, PERKENI/PERDOSSI/IDI standard terminology where applicable).

---

## SECTION 6 — Surface Rendering Smoke Test

After integration, test the key surfaces that render the new content.

### For New Exam Sets

Test Surface 17 (Quiz):
- [ ] Exam set appears in the quiz selection screen
- [ ] First 3 questions load with correct stems and 4 options
- [ ] Selecting an answer reveals the explanation
- [ ] Confidence badge displays the correct category label
- [ ] Difficulty indicator is visible

Test Surface 18 (Flashcard):
- [ ] Exam set appears in the flashcard deck selection
- [ ] Card front shows the question stem
- [ ] Card back shows the correct answer and explanation
- [ ] Topic tags are visible

### For New Lecture Modules

Test Surface 12 (PageImageCard):
- [ ] Module sections load in correct order
- [ ] Sections with `visual_ref` show either the actual image or the colored placeholder card
- [ ] Placeholder cards show the correct `placeholderIcon` and `title`
- [ ] No broken/blank image cards

Test Surface 13 (MediaViewer3D) — if module has 3D assets:
- [ ] 3D assets with `type: "diagram_3d"` load the 3D viewer (or fall back to image card if `assetUrl` is null)

### For all new content:
- [ ] No JavaScript console errors in the browser related to the new content
- [ ] Content loads in under 3 seconds on a simulated slow connection
- [ ] No broken layout or rendering anomalies on mobile viewport

---

## SECTION 7 — Fallback Content

### 7.1 CRITICAL — Fallback content still working

Verify that existing content (content loaded before this integration) continues to render correctly. The integration of new content must not break any existing entries in:
- `content_index.kimi.json` (no existing entries modified unintentionally)
- `visual_asset_manifest.generated.json` (no existing asset IDs changed)

### 7.2 WARNING — Demo content still accessible

The demo files (`app_data/demo/exam_asli_01.json`, `app_data/demo/exam_ai_01.json`) should still be registered and accessible. Do not remove demo entries from `content_index.kimi.json` unless explicitly directed.

---

## SECTION 8 — Performance Guidelines

### 8.1 WARNING — module.json file size

module.json files should remain within these size targets:
- Under 500 KB: Ideal, no action needed
- 500 KB – 1 MB: Acceptable, note in metadata
- 1 MB – 2 MB: Large — consider splitting the module into sub-modules
- Over 2 MB: Too large — must split before publishing

### 8.2 WARNING — exam_set.json file size

exam_set.json files should remain within:
- Under 200 KB: Ideal
- 200 KB – 500 KB: Acceptable
- Over 500 KB: Large — investigate if explanations are excessively verbose; consider a long-form explanations companion file

### 8.3 WARNING — visual_asset_manifest.generated.json file size

The manifest grows with every new asset. Monitor size:
- Under 1 MB: Fine
- Over 1 MB: Consider splitting the manifest by module (one manifest file per module) and update the loading logic accordingly.

---

## INTEGRATION SIGN-OFF

Before marking integration as complete, confirm:

- [ ] All CRITICAL items in all sections above have passed
- [ ] All WARNINGS have been investigated (resolved or documented)
- [ ] `content_index.kimi.json` is saved with today's `generatedAt` date
- [ ] Smoke tests completed for new surfaces
- [ ] Existing content still renders correctly

Record the integration date and any outstanding warnings in `content_index.kimi.json` under a `lastIntegration` field (optional, add if not present):
```json
"lastIntegration": {
  "date": "2026-06-10",
  "added": ["set_asli_02", "bank_soal_ai_02"],
  "warnings": []
}
```
