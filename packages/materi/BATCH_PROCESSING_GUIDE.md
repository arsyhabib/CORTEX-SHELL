# BATCH_PROCESSING_GUIDE.md
# CORTEX-SHELL — Multi-Batch PDF Processing Protocol
# Version: 1.0 | Permanent Anchor File
# Purpose: How to process up to 60 PDFs across multiple batches and merge into one module.json

---

## Overview

When a module topic requires more PDFs than can fit in a single agent call (maximum 10 PDFs per batch), the content must be processed in sequential batches, then merged into one complete `module.json`. This guide defines the protocol for maintaining consistency, continuity, and zero data loss across batches.

**Bahasa Indonesia:** Ketika sebuah modul memerlukan lebih dari 10 PDF, konten harus diproses dalam beberapa batch berurutan, kemudian digabungkan menjadi satu `module.json` yang lengkap. Panduan ini mendefinisikan protokol untuk menjaga konsistensi dan tidak ada data yang hilang antar batch.

---

## PART 1 — BATCH PLANNING

### 1.1 Maximum Batch Size

- **Hard limit**: 10 PDFs per batch call
- **Recommended**: 6–8 PDFs per batch for optimal processing depth
- Never mix PDFs from different module topics in the same batch

### 1.2 Total Scale Reference

For a full 60-PDF module (maximum scale):
- Batch count: 6 batches of 10 PDFs each
- Estimated sections: 60–72 sections total
- Estimated processing time: 6 separate agent calls + 1 merge call

### 1.3 Batch Planning Worksheet

Before starting any multi-batch module, create a Batch Planning document:

```
MODULE: [module_id]
TOPIC: [clinical topic]
TOTAL PDFs: [N]
BATCHES PLANNED: [N]

BATCH 01: [filename1.pdf, filename2.pdf, ..., filename10.pdf]
          Estimated sections: s01–s11
          Estimated topic coverage: [topic list]

BATCH 02: [filename11.pdf, ..., filename20.pdf]
          Estimated sections: s12–s22
          Estimated topic coverage: [topic list]

BATCH 03: [...]
          Estimated sections: s23–s33

[Continue for all batches...]
```

---

## PART 2 — BATCH NAMING CONVENTIONS

### 2.1 Batch ID Format

```
batch_[zero-padded-2-digit-number]
```

Examples: `batch_01`, `batch_02`, `batch_06`

### 2.2 Module ID for Batched Modules

When a module is processed in multiple batches, the final merged module retains a single `id`. The intermediate batch outputs use a working naming convention:

```
[module_id]_batch_[number]_DRAFT.json
```

Examples:
```
mod_neuro_stroke_001_batch_01_DRAFT.json
mod_neuro_stroke_001_batch_02_DRAFT.json
mod_neuro_stroke_001_batch_03_DRAFT.json
mod_neuro_stroke_001_MERGED_FINAL.json    ← Final output
```

### 2.3 Output Directory Structure

```
app_data/domains/materi/modules/[module_id]/
├── module.json                              ← Final merged output (production)
├── _drafts/
│   ├── mod_[id]_batch_01_DRAFT.json
│   ├── mod_[id]_batch_02_DRAFT.json
│   ├── mod_[id]_batch_03_DRAFT.json
│   └── mod_[id]_MERGED_FINAL.json
└── _source_pdfs/
    ├── batch_01/
    │   ├── lecture_file_01.pdf
    │   └── lecture_file_02.pdf
    ├── batch_02/
    │   └── ...
    └── batch_03/
        └── ...
```

---

## PART 3 — SECTION ID CONTINUITY

### 3.1 The Rule

Section IDs must be globally unique within a module and sequential across ALL batches. There must be NO ID gaps and NO ID overlaps.

### 3.2 Section ID Assignment by Batch

Each batch receives a pre-assigned section ID range. Plan this BEFORE starting batch processing:

| Batch | Section ID Range | Max Sections |
|---|---|---|
| batch_01 | s01 – s11 | 11 sections |
| batch_02 | s12 – s22 | 11 sections |
| batch_03 | s23 – s33 | 11 sections |
| batch_04 | s34 – s44 | 11 sections |
| batch_05 | s45 – s55 | 11 sections |
| batch_06 | s56 – s66 | 11 sections |

The agent processing batch_02 must begin section IDs at `s12` regardless of how many sections batch_01 actually produced. This is enforced by the Batch Planning worksheet.

### 3.3 Actual vs. Allocated Slots

If batch_01 produces only 8 sections (s01–s08), batch_02 still starts at s12. Sections s09–s11 are unused — this is acceptable. The final module will have non-contiguous IDs (s01–s08, s12–s19), which is acceptable as long as IDs are unique.

Alternatively, if tight ID continuity is required, the merge step can re-index all sections sequentially (s01, s02, s03... throughout).

### 3.4 Batch Context Handoff Document

The agent processing batch_02 must receive the following context document (generated at the end of batch_01 processing):

```
BATCH_HANDOFF_CONTEXT:
  Module ID: [module_id]
  Module Title: [title]
  Completed batches: [batch_01]
  Sections already created: [s01, s02, s03, s04, s05, s06, s07, s08]
  Next section ID to use: s12
  Glossary terms already defined: [list of term IDs]
  Visual IDs already assigned: [last visual number used: 12]
  Topics already covered:
    - s01: Epidemiology & Global Burden
    - s02: Pathophysiology — Ischemic Cascade
    - s03: Clinical Presentation & NIHSS
    [...]
  Topics NOT YET covered (to be covered in batch_02):
    - Neuroimaging
    - IV Thrombolysis
    - Mechanical Thrombectomy
    [...]
  Glossary terms NOT YET defined (to be added in batch_02 or later):
    - mechanical_thrombectomy
    - aspects_score
    - hemorrhagic_transformation
    [...]
```

This handoff document ensures the batch_02 agent has full context and does not duplicate or contradict batch_01 content.

---

## PART 4 — HANDLING DUPLICATE CONTENT ACROSS PDFs

### 4.1 Identifying Duplicates

During batch processing, maintain a **Topic Coverage Map** — a running list of topics already covered. When a subsequent PDF covers the same topic:

1. Check if the new PDF adds NEW clinical information (updated statistics, different perspective, more detail)
2. Check if the new PDF contradicts existing content
3. Check if the new PDF is simply a repeat of the same slides

### 4.2 Duplicate Handling Decision Tree

```
New PDF has content on Topic X (already covered in s03):

Is the new content IDENTICAL to existing? (same slides, same words)
  → YES: Skip — do not create duplicate section. Log in DUPLICATE_LOG.
  → NO: Continue...

Does the new content ADD new clinical information?
  → YES: Add a new content paragraph to existing s03 content OR 
         create a new section "s03b" with heading "Topic X — Advanced Concepts"
  → NO: Skip. Log as redundant.

Does the new content CONTRADICT existing content?
  → YES: Flag in ai_additions with type "contradiction_resolved"
         Use the more authoritative/recent source
         Add a teaching_point callout noting the discrepancy if clinically significant
```

### 4.3 Duplicate Log Format

Maintain an internal log during processing (not in final JSON):

```
DUPLICATE_LOG:
  [1] PDF: lecture_3.pdf | Pages: 12–15
      Topic: NIHSS Assessment
      Status: DUPLICATE — identical content to s03 batch_01
      Action: SKIPPED

  [2] PDF: lecture_5.pdf | Pages: 22–24
      Topic: IV tPA dosing
      Status: PARTIAL_DUPLICATE — same dosing table, BUT adds updated contraindications list
      Action: Added contraindication content to s07 as additional bullet and callout

  [3] PDF: lecture_7.pdf | Pages: 5–8
      Topic: Mechanical Thrombectomy (already in s08)
      Status: NEW_DETAIL — adds DAWN trial data not in original source
      Action: Created new content paragraph in s08 with DAWN trial details
              Tagged ai_additions with type "guideline_addition"
```

---

## PART 5 — VISUAL ASSET ID UNIQUENESS ACROSS BATCHES

### 5.1 The Rule

Visual IDs must be unique across ALL batches of a module. A visual from batch_02 cannot have the same ID as a visual from batch_01.

### 5.2 Sequential Numbering Across Batches

The sequential number in `visual_[topic]_[descriptor]_[number]` continues from the last number used in the previous batch.

From the Batch Handoff Context:
```
Last visual number used in batch_01: 12
Next visual number in batch_02: starts at 13
```

Batch_02 agent assigns: `visual_stroke_..._13`, `visual_stroke_..._14`, etc.

### 5.3 Visual ID Registry Handoff

Include in every Batch Handoff Context:
```
VISUAL_ID_REGISTRY (batch_01 used):
  visual_stroke_epidemiology_01
  visual_stroke_age_distribution_02
  visual_stroke_ischemic_cascade_03
  visual_stroke_penumbra_core_04
  visual_stroke_therapeutic_window_timeline_05
  [... all visual IDs used so far]
  Last number: 12
  Next batch starts at: 13
```

---

## PART 6 — GLOSSARY TERM ID UNIQUENESS

### 6.1 The Rule

Glossary term IDs must be unique within the final merged module.json. A term may NOT be defined twice, even if it appears in multiple batch PDFs.

### 6.2 Term Registry Handoff

Include in every Batch Handoff Context:
```
GLOSSARY_TERM_REGISTRY (already defined in batch_01):
  stroke_iskemik
  ischemic_cascade
  penumbra
  nihss
  tpa_alteplase
  lvo
  [... all terms defined so far]
```

### 6.3 Handling Terms That Appear in Multiple Batches

If a PDF in batch_02 introduces a term already in batch_01's glossary:
- Do NOT redefine the term
- Use the existing term ID in `glossary_refs[]` for sections in batch_02
- If the new PDF provides BETTER or MORE COMPLETE information about the term, update the existing glossary entry during the merge step — do not create a duplicate

### 6.4 New Terms in Later Batches

New terms found only in batch_02 or batch_03 are added to the glossary normally. They use the same term ID format: `snake_case` of the term name.

---

## PART 7 — MERGING BATCH OUTPUTS

### 7.1 When to Merge

Merge all batch DRAFT files into the final `module.json` ONLY when:
- All planned batches have been processed
- All DRAFT files are available
- No further PDF batches are pending

### 7.2 Merge Process — Step by Step

**Step 1: Collect all DRAFT files**
List all batch draft files and confirm count matches planned batches.

**Step 2: Merge module-level fields**
The final merged module uses:
- `id`: Same as planned
- `title`, `subtitle`, `domain`: From batch_01 (primary)
- `batch_id`: `"batch_all"` or `"batch_01_through_N"`
- `source_pdf`: Comma-separated list of ALL PDFs across all batches
- `topicTags`: Union of all tag arrays, deduplicated
- `summary[]`: Merge all summaries (6–10 sentences total), remove any duplicates
- `exam_focus[]`: Merge all exam_focus arrays, remove duplicates
- `glossary[]`: Merge all unique terms — deduplicate by term name
- `bilingual[]`: Merge all unique concept entries — deduplicate by `concept` field
- `visual_asset_manifest[]`: Concatenate all manifests — all IDs should already be unique

**Step 3: Merge sections[]**
Simply concatenate all section arrays in batch order:
- batch_01 sections: s01–s08
- batch_02 sections: s12–s19
- etc.
Sort final sections array by section ID alphanumerically.

**Step 4: Cross-reference validation**
After merge:
- Verify every `glossary_refs[]` entry exists in merged `glossary[]`
- Verify every `visual_refs[]` entry exists in merged `visual_asset_manifest[]`
- Verify no duplicate section IDs
- Verify no duplicate glossary term IDs
- Verify no duplicate visual IDs

**Step 5: Re-indexing (optional)**
If section IDs have gaps (s01–s08, s12–s19), optionally re-index sequentially:
- s01, s02, ... s08, s09, s10, s11, s12...
- Update all `section_id` references in `visual_asset_manifest[]` if re-indexing

**Step 6: Final validation**
Run the full `OUTPUT_VALIDATION_CHECKLIST.md` on the merged file.

---

## PART 8 — CONTENT_INDEX.KIMI.JSON UPDATE PROCEDURE

### 8.1 What is content_index.kimi.json?

`content_index.kimi.json` is the domain-level index file that catalogs all modules within a domain. It must be updated whenever a new module.json is finalized.

### 8.2 Location

```
app_data/domains/materi/content_index.kimi.json
```

### 8.3 Entry to Add

For each finalized module, add an entry to the index:

```json
{
  "module_id": "mod_neuro_stroke_001",
  "title": "Acute Ischemic Stroke",
  "subtitle": "Pathophysiology, Diagnosis & Management",
  "domain": "neuro_emergency",
  "topicTags": ["Stroke", "Neuroemergency", "Thrombolysis", "Thrombectomy"],
  "section_count": 11,
  "glossary_count": 15,
  "visual_count": 22,
  "source_pdf": "Neuro_Emergency_2025_Batch1.pdf",
  "batch_id": "batch_01",
  "created": "2025-01-15",
  "status": "published"
}
```

### 8.4 Update Process

1. Read current `content_index.kimi.json`
2. Add the new module entry to the modules array
3. Update `total_modules` count
4. Update `last_updated` timestamp
5. Save the updated index file

---

## PART 9 — COMMON BATCH PROCESSING ERRORS AND FIXES

### Error 1: Section ID Collision
**Symptom**: Two sections have the same ID (e.g., `s05` appears in batch_01 and batch_02)
**Fix**: During merge, manually re-assign the conflicting section ID from the later batch. Update all references to that section ID in `glossary_refs` and `visual_asset_manifest`.

### Error 2: Duplicate Glossary Terms
**Symptom**: Merged glossary has two entries with the same `term` value
**Fix**: Keep the more complete definition. Remove the duplicate. Verify all `glossary_refs` still point to valid term IDs.

### Error 3: Visual ID Overlap
**Symptom**: Two visual_asset_manifest entries have the same `visual_id`
**Fix**: Rename the later one by incrementing its number. Update all `visual_refs[]` references.

### Error 4: Missing Batch Handoff Context
**Symptom**: Batch_02 agent created sections starting at s01 (should start at s12)
**Fix**: Manually re-index the batch_02 sections to the correct range before merging. This is tedious — always provide Batch Handoff Context.

### Error 5: Cross-batch Contradiction
**Symptom**: Section in batch_01 says "drug dosage is X", section in batch_02 says "drug dosage is Y"
**Fix**: Determine the authoritative source (prefer current guidelines over lecture notes). Update the less authoritative section to match. Add a `warning` callout if the discrepancy is clinically significant.

---

## PART 10 — BATCH PROCESSING QUICK REFERENCE CARD

```
BEFORE BATCH 1:
  □ Create Batch Planning Worksheet
  □ Assign section ID ranges per batch
  □ Confirm all PDF files are available

AFTER EACH BATCH:
  □ Generate Batch Handoff Context document
  □ Log: sections created, glossary terms defined, visual IDs used
  □ Save DRAFT file to _drafts/ directory
  □ Review for quality before starting next batch

BEFORE MERGE:
  □ All batches complete
  □ All DRAFT files saved
  □ No pending PDFs

DURING MERGE:
  □ Merge module-level fields (deduplicate)
  □ Concatenate sections[] in order
  □ Validate all cross-references
  □ Optionally re-index sections
  □ Run OUTPUT_VALIDATION_CHECKLIST.md

AFTER MERGE:
  □ Copy final module.json to production path
  □ Update content_index.kimi.json
  □ Archive DRAFT files
```

---

*CORTEX-SHELL Batch Processing Guide v1.0*
*Permanent anchor file — update only when processing architecture changes.*
