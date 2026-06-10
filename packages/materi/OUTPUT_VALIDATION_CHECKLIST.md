# OUTPUT_VALIDATION_CHECKLIST.md
# CORTEX-SHELL — module.json Self-Validation Checklist
# Version: 1.0 | Permanent Anchor File
# Purpose: QA checklist for the AI agent to run before submitting final module.json
# Usage: Work through every item. Only submit when ALL items are checked or explicitly noted as N/A.

---

## Overview

This checklist is the final quality gate before a `module.json` is considered production-ready. The AI agent must self-validate every output against this checklist before delivery. Reviewers will use this same checklist to audit submitted modules.

**Bahasa Indonesia:** Checklist ini adalah pintu QA terakhir sebelum `module.json` dianggap siap produksi. AI agent harus memvalidasi setiap output menggunakan checklist ini sebelum menyerahkan hasilnya.

**How to use**: Read each item. Mark as `[PASS]`, `[FAIL: description]`, or `[N/A: reason]`. A single `[FAIL]` item must be corrected before submission. Document your validation result as a comment block at the end of the JSON file (or in a companion .txt file).

---

## SECTION A — SOURCE PROCESSING COMPLETENESS

### A1 — All PDFs Processed
- [ ] Every PDF file in the batch was analyzed (not skipped due to size, format, or assumed duplication)
- [ ] Page count was verified for each PDF
- [ ] Extraction log exists for each PDF (internal working document)

**Check**: Did you process [N] PDFs for this batch? Confirm the count matches the batch specification.

### A2 — Image-Only PDFs
- [ ] For any PDF identified as `PDF_TYPE: FULLY_IMAGE_BASED`, vision analysis was applied to every page
- [ ] Text from image-based pages was extracted via OCR or vision description
- [ ] No image-based page was skipped due to "no extractable text"

### A3 — Handwritten Annotations
- [ ] All handwritten annotations found in PDFs were extracted and integrated into relevant sections
- [ ] Handwritten content was not silently discarded
- [ ] Handwritten corrections that contradict printed text were resolved with a note

### A4 — Tables
- [ ] All tables found in source PDFs were extracted (as structured text or as visual_asset_manifest entries if image-based)
- [ ] Table data appears in `content[]` paragraphs, `bullets[]`, or as `reference_card` type visual assets

### A5 — Batch Content Coverage
- [ ] All major clinical topics present in the batch PDFs have a corresponding section in `sections[]`
- [ ] No significant topic from the PDFs is missing from the module
- [ ] Topics without PDF coverage (if any AI-only sections were created) are noted in those sections' `summary` fields

---

## SECTION B — MODULE-LEVEL FIELD VALIDATION

### B1 — Required Module Fields Present
Confirm each field is present (not missing, not null):
- [ ] `id` — follows format `mod_[domain]_[topic]_[number]`
- [ ] `title` — 2–6 words, Title Case, English
- [ ] `subtitle` — 3–8 words, Title Case, English
- [ ] `domain` — matches registered domain identifier
- [ ] `batch_id` — follows format `batch_[number]`
- [ ] `source_pdf` — exact filename(s) with extension
- [ ] `source_filename` — filename without extension
- [ ] `topicTags` — array with 3–6 string items
- [ ] `summary` — array with 5–7 string items
- [ ] `exam_focus` — array with 6–10 string items
- [ ] `glossary` — array with 12–20 objects
- [ ] `bilingual` — array with 3–5 objects
- [ ] `sections` — array with 8–14 objects (or proportional to batch size)

### B2 — Summary Quality
- [ ] Each `summary[]` item is a complete sentence (subject + predicate)
- [ ] Each summary item contains at least one specific clinical fact (not generic)
- [ ] No two summary items say the same thing (no redundancy)
- [ ] Summary items together cover: definition/epidemiology, pathophysiology, diagnosis, treatment, prognosis/prevention

### B3 — Exam Focus Quality
- [ ] Each `exam_focus[]` item is a specific, testable topic (includes thresholds, criteria, or comparisons)
- [ ] No item is vague (e.g., "Understand stroke management" is FAIL — "tPA eligibility criteria: timing windows, BP threshold, INR limit" is PASS)
- [ ] Items are phrased as study targets, not as questions

### B4 — Glossary Quality
- [ ] Term count: 12–20 terms
- [ ] Each term has a `meaning` of at least 60 words
- [ ] No two terms have the same meaning (no copy-paste definitions)
- [ ] `meaning` fields are in Bahasa Indonesia (not English)
- [ ] No truncated definitions (no "..." or "see above" in definitions)
- [ ] Clinically significant terms (drugs, scoring systems, key syndromes) are defined

### B5 — Module-level Bilingual Quality
- [ ] 3–5 concept entries present
- [ ] Each entry has all required fields: `concept`, `title`, `simple_id`, `bilingual_id`, `bilingual_en`, `medical_id`
- [ ] `simple_id` has zero medical jargon (comprehensible to non-medical adult)
- [ ] `bilingual_id` and `bilingual_en` cover the same information (not just a translation of `simple_id`)
- [ ] `medical_id` is at specialist level with full mechanism and terminology
- [ ] No bilingual entry is a copy of another entry with different phrasing

---

## SECTION C — SECTION-LEVEL FIELD VALIDATION

Run this check for EVERY section in `sections[]`.

### C1 — Required Section Fields
For each section, confirm presence of:
- [ ] `id` — unique, follows `s[NN]` format
- [ ] `title` — distinct from all other section titles
- [ ] `kind` — value is `"Reading"`
- [ ] `summary` — present, 1–2 sentences, in Bahasa Indonesia
- [ ] `content` — array with 3–5 paragraph objects
- [ ] `bullets` — array with 4–6 bullet objects
- [ ] `callouts` — array with 3–5 callout objects
- [ ] `visual_refs` — present (may be `[]`)
- [ ] `glossary_refs` — present (may be `[]`)
- [ ] `quiz_refs` — present (always `[]` on initial generation)
- [ ] `bilingual` — single object (not array)
- [ ] `ai_additions` — present (may be `[]`)

### C2 — Content Quality per Section
- [ ] Each content paragraph is 80–150 words (not too short, not truncated)
- [ ] No content paragraph ends mid-sentence or with "..."
- [ ] No placeholder text (no "Lorem ipsum", no "[PLACEHOLDER]", no "TBD")
- [ ] No content paragraph is a repeat of another paragraph within the section
- [ ] No content paragraph is a repeat of a paragraph in a different section
- [ ] Paragraph 1 covers the core definition from source material
- [ ] Medical terminology is spelled correctly

### C3 — Bullets Quality per Section
- [ ] 4–6 bullet objects present per section
- [ ] Each bullet has a `text` field (non-empty)
- [ ] Each bullet with `sub` array has 2–4 sub-items (not 1, not 5+)
- [ ] `tone` values are only: `"ok"`, `"warn"`, `"danger"` (or omitted for neutral)
- [ ] Critical/safety content uses `"warn"` or `"danger"` tone
- [ ] Bullet text is exam-relevant and includes specific thresholds/values where applicable

### C4 — Callouts Quality per Section
- [ ] 3–5 callout objects present per section
- [ ] `tone` values are only: `"exam_pearl"`, `"clinical_pearl"`, `"warning"`, `"teaching_point"`
- [ ] At least one `exam_pearl` per section
- [ ] At least one `warning` or `clinical_pearl` per section
- [ ] Each callout `title` is specific and descriptive (not "Important Note")
- [ ] Each callout `text` is 2–4 sentences with actionable clinical content
- [ ] No callout text is truncated

### C5 — Section Bilingual Quality
- [ ] Each section has a `bilingual` object (not array)
- [ ] `concept` field present and matches section topic
- [ ] `simple_id` is in plain Bahasa Indonesia, comprehensible to non-medical reader
- [ ] `bilingual_id` is in academic Bahasa Indonesia
- [ ] `bilingual_en` is in academic English
- [ ] `medical_id` is at specialist-level Bahasa Indonesia
- [ ] Fields are not blank or placeholder

### C6 — AI Additions Tracking
- [ ] `ai_additions` array is present in every section
- [ ] Every AI-enriched content item is represented in `ai_additions` (locations accurately noted)
- [ ] `type` values are from the approved type list
- [ ] `source_basis` field is specific (not "AI knowledge" — should cite Harrison's, guidelines, trial name, etc.)
- [ ] Bilingual content is tagged in `ai_additions` (all bilingual is AI-generated)
- [ ] If section is 100% source content, `ai_additions` is `[]`

---

## SECTION D — VISUAL ASSET VALIDATION

### D1 — Every Source PDF Image is Cataloged
- [ ] During extraction, you identified ALL visual elements from ALL pages of ALL PDFs
- [ ] Each visual element has a `visual_id` assigned
- [ ] Each `visual_id` appears in the relevant section's `visual_refs[]` array
- [ ] Each `visual_id` appears in `visual_asset_manifest[]` with full metadata

### D2 — Visual ID Uniqueness
- [ ] No two entries in `visual_asset_manifest[]` have the same `visual_id`
- [ ] Sequential numbers are correct and unique within the module
- [ ] Cross-batch: no visual IDs from this batch clash with visual IDs in previous batches (if applicable)

### D3 — Visual Manifest Completeness
For each entry in `visual_asset_manifest[]`:
- [ ] `visual_id` follows naming convention: `visual_[topic]_[descriptor]_[number]`
- [ ] `source_pdf` is the exact filename of the PDF where the image was found
- [ ] `source_page` is a positive integer (1-indexed)
- [ ] `asset_type` is from the approved 15-type list
- [ ] `title` is 4–10 words, English, descriptive
- [ ] `alt_text` is 2–4 sentences, 50–120 words, clinical description
- [ ] `subtitle` is one sentence, teaching point
- [ ] `tags` has 3–8 items
- [ ] `placeholderColor` is a valid hex code from the approved color table
- [ ] `placeholderIcon` is a valid icon name
- [ ] `section_id` references a real section ID in `sections[]`
- [ ] `ai_generated` is `false` for source images, `true` for AI-described placeholders

### D4 — Low-Quality Images Handled Correctly
- [ ] Blurry/unclear images were cataloged (not dropped silently) with `asset_type: "unknown"`
- [ ] Alt text for unclear images describes what can be seen, not what is assumed
- [ ] Low-quality images are tagged `"low_quality"` in their `tags` array

---

## SECTION E — CROSS-REFERENCE INTEGRITY

### E1 — Glossary References
- [ ] Every string in every section's `glossary_refs[]` array has a matching term in the module's `glossary[]` array
- [ ] No `glossary_refs` entry references a term that is NOT in the `glossary[]`
- [ ] Term IDs in `glossary_refs[]` are snake_case versions of the term (e.g., `"tpa_alteplase"` for term `"tPA / Alteplase"`)

**Quick check**: Extract all unique values from all `glossary_refs[]` arrays. Extract all term names from `glossary[]`. Verify 100% overlap.

### E2 — Visual References
- [ ] Every string in every section's `visual_refs[]` array has a matching entry in `visual_asset_manifest[]` (by `visual_id`)
- [ ] No `visual_refs` entry references a visual_id that does NOT exist in `visual_asset_manifest[]`

### E3 — Section ID Integrity (Multi-batch)
- [ ] All section IDs are unique within this module
- [ ] Section IDs fall within the pre-assigned range for this batch
- [ ] No section ID from this batch clashes with section IDs from previous batches

---

## SECTION F — JSON SYNTAX VALIDATION

### F1 — JSON Structural Validity
- [ ] The output is valid JSON (parseable without errors by a standard JSON parser)
- [ ] No trailing commas after last item in arrays or objects
- [ ] No comments inside the JSON (JSON does not support `//` or `/* */` comments)
- [ ] All strings are double-quoted (not single-quoted)
- [ ] All special characters inside strings are properly escaped (`\"`, `\\`, `\n`)
- [ ] No undefined, NaN, or Infinity values
- [ ] No null values for required fields (use `[]` for empty arrays, `""` only where explicitly allowed)

### F2 — Encoding
- [ ] File uses UTF-8 encoding
- [ ] Indonesian characters (é, ä, ö, special chars) are correctly encoded (not garbled)
- [ ] No byte-order marks (BOM) at start of file
- [ ] No non-printable control characters embedded in strings

### F3 — Structure
- [ ] Root element is an object `{...}` not an array `[...]`
- [ ] All required top-level keys are present
- [ ] `sections` key contains an array of objects
- [ ] Each section object contains all required keys

---

## SECTION G — CONTENT RATIO VALIDATION

### G1 — 60/40 Ratio Adherence
For a random sample of 3 sections, estimate the ratio:
- [ ] Source content is approximately 60% of total word count
- [ ] AI-generated content is approximately 40% of total word count
- [ ] No section is >90% AI-generated (unless explicitly marked as `AI_only_section`)
- [ ] No section is 100% source-extracted (every section should have at least bilingual content, which is AI-generated)

### G2 — AI Content is Tagged
- [ ] All AI-generated content appears in `ai_additions[]` tracking
- [ ] Bilingual entries are tagged
- [ ] `exam_pearl` and `clinical_pearl` callouts are tagged
- [ ] Added guideline recommendations are tagged
- [ ] No AI additions exist without a corresponding entry in `ai_additions[]`

### G3 — Prohibited AI Content Absent
- [ ] No fabricated patient case data
- [ ] No fabricated statistics presented as source facts
- [ ] No drug dosages that contradict source PDFs (unless flagged with correction note)
- [ ] No clinical guidelines cited as current if agent is uncertain of last update date (use hedging language)

---

## SECTION H — MEDICAL ACCURACY SPOT CHECKS

### H1 — Drug Information Accuracy
For every drug mentioned in the module:
- [ ] Generic name is correct and spelled correctly
- [ ] Dosage is present (if clinically significant)
- [ ] Route of administration is specified
- [ ] Major contraindications are mentioned if the drug has life-threatening contraindications
- [ ] No dosages invented without source or AI_RESEARCH tag

### H2 — Diagnostic Criteria Accuracy
For every scoring system or diagnostic criteria mentioned:
- [ ] Score range is correct
- [ ] Interpretation of score levels is correct
- [ ] Clinical cutoffs match validated version of the tool

### H3 — Epidemiological Data
- [ ] Statistics are plausible (not orders of magnitude off from expected values)
- [ ] Source of epidemiological data is noted (source PDF vs AI_RESEARCH)
- [ ] No Indonesian-specific data used without Indonesian source basis

---

## SECTION I — WORD COUNT AND QUALITY SANITY CHECKS

### I1 — Content Density
- [ ] Each `content[]` paragraph: 80–150 words (not too thin, not too long)
- [ ] `summary[]` items: 50–200 characters each
- [ ] `exam_focus[]` items: 30–150 characters each
- [ ] `glossary[].meaning`: at least 60 words per definition
- [ ] `bilingual.simple_id`: 40–150 words
- [ ] `bilingual.medical_id`: 80–250 words

### I2 — Language Quality
- [ ] No obvious grammatical errors in English content paragraphs
- [ ] Indonesian medical terminology is correct (Indonesian medical terms, not literal translations of English)
- [ ] No mixing of Indonesian and English within the same sentence (except for medical terms that are standardly used in both)
- [ ] All Latin medical terms are correctly spelled

### I3 — Academic Tone
- [ ] Content reads as a clinical study guide, not a casual blog post
- [ ] No emoji, no informal language, no first-person ("I", "you", "we")
- [ ] No marketing language ("amazing", "groundbreaking", "revolutionary")
- [ ] No hedging without basis ("might", "could be", "it is possible that" — only when genuinely uncertain)

---

## FINAL VALIDATION SUMMARY

After completing all checklist items above, produce this summary:

```
VALIDATION_SUMMARY:
  Module ID: [id]
  Batch: [batch_id]
  Date validated: [date]
  
  Section A — Source Processing: [PASS / N items FAIL]
  Section B — Module-Level Fields: [PASS / N items FAIL]
  Section C — Section-Level Fields: [PASS / N items FAIL]
  Section D — Visual Asset Validation: [PASS / N items FAIL]
  Section E — Cross-Reference Integrity: [PASS / N items FAIL]
  Section F — JSON Syntax: [PASS / N items FAIL]
  Section G — Content Ratio: [PASS / N items FAIL]
  Section H — Medical Accuracy: [PASS / N items FAIL]
  Section I — Quality Sanity: [PASS / N items FAIL]
  
  OVERALL: [READY FOR SUBMISSION / NEEDS CORRECTION]
  
  Issues to fix before submission:
    1. [Issue description and location]
    2. [Issue description and location]
    [...]
```

**Only submit module.json when OVERALL = READY FOR SUBMISSION.**

If FAILS exist: fix them, re-validate the affected sections, then recheck the cross-references before resubmitting.

---

## COMMON FAILURE PATTERNS (LESSONS LEARNED)

These are the most frequently occurring failures — check these first:

| Failure | Where it tends to occur | How to catch it |
|---|---|---|
| Truncated sentence in content[] | Last paragraph of a section | Read the last sentence of every content paragraph |
| Missing `quiz_refs: []` | Any section | Global search for sections missing quiz_refs |
| glossary_ref not in glossary[] | Any section referencing terms from another module | Cross-reference check in Section E |
| visual_ref not in manifest | Sections where images were added as an afterthought | Build manifest first, then add refs |
| Duplicate visual_id | Multi-batch processing | Visual ID Registry handoff check |
| `bilingual` as array instead of object | Section-level bilingual | Section bilingual must be `{}` not `[{}]` |
| `tone` misspelling | bullets and callouts | Only valid: `ok`, `warn`, `danger`, `exam_pearl`, `clinical_pearl`, `warning`, `teaching_point` |
| ai_additions missing bilingual entries | Every section | Bilingual is always AI-generated |
| `simple_id` contains medical jargon | bilingual fields | Read aloud test — would a non-medical person understand this? |

---

*CORTEX-SHELL Output Validation Checklist v1.0*
*Permanent anchor file — update when schema changes or new failure patterns emerge.*
