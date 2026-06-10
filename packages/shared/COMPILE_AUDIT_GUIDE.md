# COMPILE AUDIT GUIDE — Multi-Batch AI Agent Output
**Version:** 2.0  
**Package:** packages/shared  
**Scope:** Compiling multiple batch outputs into final production files

---

## OVERVIEW

When AI agents process large content volumes across multiple batches, each batch produces a partial output file. Before these files can be used in the app, they must be:

1. Compiled into single final files (one per module or exam set)
2. Audited for internal consistency
3. Cross-checked against source content
4. Validated for broken references

This guide covers both lecture module compilation (multiple `module.json` batches) and exam batch compilation (multiple `exam_set.json` batches).

---

## PART A: COMPILING MODULE.JSON BATCHES

### A.1 When Multiple Batches Exist

A single lecture module may be processed across multiple batches when:
- The source content is too large for one agent pass
- Different sections were assigned to different agents
- A partial batch was reprocessed after corrections

Each batch produces a `module.json` (or a named batch file like `module_batch_1.json`, `module_batch_2.json`). These must be merged into a single canonical `module.json`.

### A.2 Section ID Deduplication

Before merging, identify all `sectionId` values across all batch files. If two batches contain sections with the same ID, you have a conflict.

Deduplication rules:
1. If the sections have identical content → Keep one, discard the other. Log in audit report.
2. If the sections have different content but the same ID → One is likely a reprocessed replacement. Keep the newer version (higher batch number or later `processed_date`). Log both versions in audit report.
3. If the IDs are different but content is near-identical → Flag as potential duplicate. Keep both but note in `metadata.notes`.

After deduplication, check that all retained section IDs are unique within the merged file.

### A.3 Section Ordering

After merging sections from multiple batches, reorder them by their intended curriculum sequence:

1. Use the source content's table of contents or section headings as the authoritative order.
2. If batch 1 produced sections s01–s05 and batch 2 produced sections s06–s11, merge in order.
3. If a batch produced sections out of order (e.g., batch 2 has s03 because it was missed in batch 1), insert the section at the correct curriculum position.
4. Renumber sections sequentially after reordering: s01, s02, s03, ... sNN.

After reordering, update all internal cross-references that use section IDs (e.g., `visual_refs` linking to a sectionId).

### A.4 Detecting and Resolving Content Gaps

A content gap is a topic area covered in the source document that has no corresponding section in any batch output.

To detect gaps:
1. List all major headings in the source content document (content.md).
2. List all `sectionTitle` values across all batch output sections.
3. Map each heading to a section. Any heading with no matching section is a gap.

Gap resolution:
- **Minor gap** (sub-topic, optional detail): Note in audit report as "low priority — not blocking."
- **Major gap** (core concept, essential for exam coverage): Flag as "high priority — requires reprocessing."
- Reprocess missing sections in a targeted follow-up batch (not a full reprocess). Merge the output as a patch.

Document all gaps in the audit report under "Content Gap Analysis."

### A.5 Merging Procedure

Step-by-step:

1. Read all batch files for the target module.
2. Extract all `sections[]` arrays.
3. Deduplicate by sectionId (follow rules in A.2).
4. Sort sections by curriculum order (follow rules in A.3).
5. Merge all sections into a single `sections[]` array.
6. Merge all `glossary[]` entries:
   - Deduplicate by term (case-insensitive match).
   - Keep the entry with the more complete definition.
7. Merge all `flashcards[]` entries:
   - Deduplicate by `front` text (near-exact match).
   - Keep the entry with the more detailed `back` text.
8. Update top-level metadata:
   - `sectionCount` = `sections[].length`
   - `wordCount` = sum of word counts across all sections
   - `processed_date` = today
   - `batch_id` = "merged"
9. Write the merged file to the canonical output path.
10. Run `APP_INTEGRATION_CHECKLIST.md` before registering in `content_index.kimi.json`.

---

## PART B: AUDITING AI-GENERATED CONTENT

### B.1 AI-Generated vs Source Content Ratio

After compiling, audit the content coverage ratio:

- Count the total word count in the source content document (content.md).
- Count the total word count in the compiled module.json (sum of all section content fields).
- Calculate the ratio: `output_words / source_words`.

Targets:
- Ratio > 0.7 (70%): Good coverage — proceed.
- Ratio 0.4–0.7 (40–70%): Moderate coverage — check for major gaps before proceeding.
- Ratio < 0.4 (< 40%): Poor coverage — likely has major gaps. Do not publish until gaps are addressed.

Note: The AI output may legitimately be shorter than the source (JSON format is more concise than prose). A ratio below 0.4 should trigger a gap detection pass (Section A.4).

### B.2 Cross-Checking visual_refs

Every `visual_ref` ID used in a `module.json` section must exist as an asset `id` in `visual_asset_manifest.generated.json`.

Broken visual_ref check:

1. Extract all `visual_ref` values from all sections in the compiled module.json.
2. Extract all `id` values from `visual_asset_manifest.generated.json`.
3. Compute the difference: any `visual_ref` that is NOT in the manifest asset IDs is a broken reference.

For each broken reference:
- Option A: The asset was not registered — add a placeholder entry to the manifest.
- Option B: The reference ID has a typo — correct the ID in the module.json.

Audit report must list all broken visual_refs with resolution action taken.

### B.3 Cross-Checking glossary_refs

Every `glossary_ref` term used in a `module.json` section must resolve to a term in the module's `glossary[]` array.

Broken glossary_ref check:

1. Extract all `glossary_ref` values from section content.
2. Extract all `term` values from `glossary[]`.
3. Any `glossary_ref` that does not match a `term` (case-insensitive) is a broken reference.

Resolution:
- Option A: The term was missed — add it to `glossary[]`.
- Option B: The reference has a spelling mismatch — standardize one and update all occurrences.

### B.4 Flagging Content for Human Review

Content should be flagged for human review when:

1. A section has `confidence: "Low"` or equivalent low-confidence marker
2. An answer was reconstructed from OCR (see soal guides)
3. A claim uses very specific numerical values (drug doses, statistical thresholds) — a clinician should verify
4. A section covers a rapidly-changing clinical guideline area (e.g., reperfusion criteria, new drug approvals)
5. A glossary definition contradicts the standard Indonesian medical terminology

Flag format in the compiled module.json:
```json
"human_review_flags": [
  "Section s04: clinical guideline figures may be outdated — verify against latest PERDOSSI/AHA guidelines",
  "Glossary term 'penumbra': definition cross-check recommended"
]
```

---

## PART C: COMPILING EXAM BATCHES

### C.1 Merging Split Exam Batches

When a single exam set was split across two batches (see `BATCH_PROCESSING_GUIDE.md`), merge them:

1. Read both `exam_set.json` files.
2. Verify the question number sequences are contiguous and non-overlapping.
3. Merge `questions[]` arrays in number order.
4. Update `metadata.total_questions` to the combined count.
5. Merge `metadata.source_pdf[]` arrays (include all PDF filenames).
6. Merge `metadata.validation_flags[]` arrays.
7. Merge `metadata.notes[]` arrays, adding a note about the merge.
8. Write the merged file to a canonical path:
   ```
   app_data/domains/exam_asli/exam_sets/[exam_id]_merged/exam_set.json
   ```
9. Update `content_index.kimi.json` to point to the merged file. Mark the split files as `status: "archived"`.

### C.2 Building the Master Question Bank

The master bank is an aggregate deduplicated question pool. See `BATCH_PROCESSING_GUIDE.md` Section "Building a Master Question Bank by Topic" for the master bank schema.

Deduplication process:
1. Load all `exam_set.json` files for the domain.
2. For each question, compute a fingerprint (e.g., normalized stem text, lowercased, punctuation removed).
3. Group questions with matching fingerprints.
4. For each group:
   - Select the most complete entry as the canonical question (best explanation, most topic_tags, confirmed answer_index).
   - Record all exam IDs where the question appeared in `source_exams[]`.
   - Set `appearance_count` to the number of source exams.
5. Assign a new `canonical_id` following the pattern:
   ```
   mq_[subject_short]_[NNN]
   ```
   Example: `mq_neuro_001`, `mq_neuro_002`
6. Write the master bank file.

High-yield identification: Questions with `appearance_count >= 3` across distinct exam years should be marked `"High-Yield"` in the master bank (regardless of their original confidence tag in the source exam set).

---

## AUDIT REPORT FORMAT

After completing a compile operation, produce an audit report in `metadata.audit_report` within the compiled file, or as a separate `audit_report.json` in the module directory.

```json
{
  "audit_date": "2026-06-10",
  "auditor": "soal_vision_agent_v2",
  "module_id": "mod_neuro_stroke_001",
  "batches_compiled": ["batch_1", "batch_2"],
  "sections_total": 11,
  "sections_deduplicated": 0,
  "sections_reordered": 2,
  "content_gaps_found": 1,
  "content_gaps_resolved": 1,
  "broken_visual_refs": 0,
  "broken_glossary_refs": 2,
  "human_review_flags": 3,
  "ai_source_coverage_ratio": 0.82,
  "status": "PASS",
  "notes": [
    "Section s07 (Complications) was reprocessed in batch_2 — batch_1 version archived",
    "Glossary terms 'penumbra' and 'core infarct' added after cross-check"
  ]
}
```

Status values:
- `"PASS"` — All critical checks passed. Ready for integration.
- `"PASS_WITH_WARNINGS"` — No critical failures but warnings require documentation.
- `"FAIL"` — Critical issues found. Do not integrate until resolved.
