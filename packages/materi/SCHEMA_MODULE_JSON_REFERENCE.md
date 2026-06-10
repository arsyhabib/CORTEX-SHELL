# SCHEMA_MODULE_JSON_REFERENCE.md
# CORTEX-SHELL — module.json Complete Field Reference
# Version: 1.0 | Permanent Anchor File
# Ground truth: app_data/domains/materi/modules/mod_neuro_stroke_001/module.json

---

## Overview

`module.json` is the canonical content unit in the CORTEX-SHELL Materi domain. Every module is a self-contained, bilingual, multi-screen learning experience covering one clinical topic. The schema is fixed — all AI agents generating module.json files must conform to this specification exactly.

**Bahasa Indonesia:** `module.json` adalah unit konten utama dalam domain Materi CORTEX-SHELL. Setiap modul adalah pengalaman belajar bilingual mandiri yang mencakup satu topik klinis. Schema ini bersifat tetap — semua output harus mematuhi spesifikasi ini.

---

## TOP-LEVEL STRUCTURE

```
module.json
├── id                        [string, REQUIRED]
├── title                     [string, REQUIRED]
├── subtitle                  [string, REQUIRED]
├── domain                    [string, REQUIRED]
├── batch_id                  [string, REQUIRED]
├── source_pdf                [string, REQUIRED]
├── source_filename           [string, REQUIRED]
├── topicTags[]               [array of strings, REQUIRED]
├── summary[]                 [array of strings, REQUIRED]
├── exam_focus[]              [array of strings, REQUIRED]
├── glossary[]                [array of objects, REQUIRED]
├── bilingual[]               [array of objects, REQUIRED]
├── visual_asset_manifest[]   [array of objects, REQUIRED if any images exist]
└── sections[]                [array of objects, REQUIRED]
```

---

## MODULE-LEVEL FIELDS

### `id`
- **Type**: string
- **Required**: Yes
- **Format**: `mod_[domain]_[topic_slug]_[batch_number]`
- **Example**: `"mod_neuro_stroke_001"`
- **Rules**: Lowercase, underscores only, no spaces. The batch number is a zero-padded 3-digit integer. Must be unique across the entire CORTEX-SHELL content database.
- **Feeds**: Module routing, URL slug, database primary key

---

### `title`
- **Type**: string
- **Required**: Yes
- **Format**: Title Case, English, clinical topic name
- **Example**: `"Acute Ischemic Stroke"`
- **Rules**: 2–6 words. Clinical and precise. Do not include "Introduction to" or "Overview of" — the title IS the topic.
- **Feeds**: Module card header, navigation, search indexing

---

### `subtitle`
- **Type**: string
- **Required**: Yes
- **Format**: Title Case, English, clinical descriptor
- **Example**: `"Pathophysiology, Diagnosis & Management"`
- **Rules**: 3–8 words. Describes the scope or angle of the module. Use "&" not "and".
- **Feeds**: Module card subheader, study session opener

---

### `domain`
- **Type**: string
- **Required**: Yes
- **Format**: Lowercase domain identifier
- **Example**: `"neuro_emergency"`
- **Rules**: Must match a registered domain in the CORTEX-SHELL domain registry. Use underscores for compound domains.
- **Known domains**: `neuro_emergency`, `cardiology`, `respiratory`, `gastroenterology`, `endocrine`, `hematology`, `nephrology`, `infectious_disease`, `pharmacology`, `anatomy`, `physiology`, `pathology`

---

### `batch_id`
- **Type**: string
- **Required**: Yes
- **Format**: `batch_[number]`
- **Example**: `"batch_1"` or `"batch_01"`
- **Rules**: Identifies which processing batch this module came from. Consistent with `BATCH_PROCESSING_GUIDE.md` naming.
- **Feeds**: Content pipeline tracking, batch merge operations

---

### `source_pdf`
- **Type**: string
- **Required**: Yes
- **Format**: Original PDF filename(s) with extension
- **Example (single)**: `"Neuro_Emergency_2025_Batch1.pdf"`
- **Example (multi)**: `"Stroke_Part1.pdf, Stroke_Part2.pdf, Stroke_Part3.pdf"`
- **Rules**: Exact filename as received. Comma-separated if multiple PDFs contributed to this module.
- **Feeds**: Content audit trail, re-processing requests

---

### `source_filename`
- **Type**: string
- **Required**: Yes
- **Format**: Primary PDF filename without extension
- **Example**: `"Neuro_Emergency_2025_Batch1"`
- **Rules**: If multiple PDFs, use the primary/first PDF's name without extension.

---

### `topicTags[]`
- **Type**: array of strings
- **Required**: Yes
- **Count**: 3–6 tags
- **Example**: `["Stroke", "Neuroemergency", "Thrombolysis", "Thrombectomy"]`
- **Rules**: Title Case. Clinical keywords. Include both the main condition and major subtopics/procedures covered. Used for search and content filtering.
- **Feeds**: Tag-based search, related module recommendations

---

### `summary[]`
- **Type**: array of strings
- **Required**: Yes
- **Count**: 5–7 sentences
- **Language**: Bahasa Indonesia (bilingual app — summary is in ID)
- **Example entry**: `"Stroke iskemik adalah penyebab kematian ketiga global — 80% dari semua stroke, memerlukan reperfusi dalam golden hour untuk mencegah disability permanen."`
- **Rules**:
  - Each sentence must stand alone as a teaching point
  - Cover: definition/epidemiology, pathophysiology core, key diagnostic point, key treatment point, secondary prevention/prognosis
  - Include specific numbers/thresholds where relevant
  - No generic statements ("This module covers stroke") — each sentence must be substantive
  - Written as declarative clinical facts, not as objectives
- **Feeds**: S1 (Module Overview screen), pre-study orientation, search snippet

---

### `exam_focus[]`
- **Type**: array of strings
- **Required**: Yes
- **Count**: 6–10 items
- **Language**: Mixed — short English and Indonesian phrases acceptable
- **Example entry**: `"IV tPA eligibility criteria dan timing window (0–3 jam vs 0–4.5 jam)"`
- **Rules**:
  - Each entry is a specific, testable exam topic
  - Include the specific threshold, criteria, or comparison being tested
  - Bad: "Know the tPA dosage" — Good: "tPA dosing: 0.9 mg/kg (max 90 mg), 10% bolus + 90% infusion over 60 min"
  - Phrased as study targets, not as questions
- **Feeds**: S2 (Exam Focus screen), study session goal-setting

---

### `glossary[]`
- **Type**: array of objects
- **Required**: Yes
- **Count**: 12–20 terms
- **Language**: Terms in their standard clinical form (Latin/English); `meaning` in Bahasa Indonesia
- **Object structure**:
```json
{
  "term": "Stroke Iskemik",
  "meaning": "Full clinical definition text..."
}
```
- **`term`** [string, REQUIRED]: The clinical term in its standard form. Title Case. May include abbreviations: `"NIHSS"`, `"tPA / Alteplase"`.
- **`meaning`** [string, REQUIRED]: 3–5 sentence definition covering:
  - Core definition
  - Pathophysiological mechanism (where applicable)
  - Clinical significance
  - Exam-relevant quantitative data (scores, thresholds, percentages)
  - Treatment implication (where applicable)
- **Rules**: No bullet points inside `meaning` — continuous prose only. Minimum 60 words per definition. Must be in Bahasa Indonesia.
- **Term ID convention**: When referenced in `glossary_refs[]` within sections, use snake_case version of the term: `"stroke_iskemik"`, `"tpa_alteplase"`, `"nihss"`, `"lvo"`.
- **Feeds**: Glossary screen (S7), in-text term popups, search

---

### `bilingual[]` (module-level)
- **Type**: array of objects
- **Required**: Yes
- **Count**: 3–5 concept entries for the most important module topics
- **Object structure**:
```json
{
  "concept": "Stroke Iskemik",
  "title": "Stroke Iskemik — Penjelasan Tiga Tingkat",
  "simple_id": "...",
  "simple_id_note": "...",
  "bilingual_id": "...",
  "bilingual_en": "...",
  "medical_id": "...",
  "medical_note": "..."
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `concept` | string | Yes | 2–4 word concept name |
| `title` | string | Yes | Display title for bilingual card. Format: "[Concept] — Penjelasan Tiga Tingkat" |
| `simple_id` | string | Yes | Bahasa Indonesia sederhana. Max 3–4 kalimat. Zero medical jargon. Target audience: general public, patient families. |
| `simple_id_note` | string | Optional | Short analogy or illustrative metaphor. Starts with "Analogi:" or "Bayangkan:". |
| `bilingual_id` | string | Yes | Bahasa Indonesia tingkat mahasiswa kedokteran. 4–6 kalimat. Uses standard medical terminology. |
| `bilingual_en` | string | Yes | English equivalent of `bilingual_id`. SAME information, same complexity level, NOT a translation of `simple_id`. |
| `medical_id` | string | Yes | Bahasa Indonesia tingkat dokter spesialis. 6–8 kalimat. Full academic medical language, mechanisms, evidence basis. |
| `medical_note` | string | Optional | One-sentence clinical or pedagogical annotation for advanced learners. |

- **Feeds**: S8 (Bilingual Explainer screen), language toggle feature

---

### `visual_asset_manifest[]`
- **Type**: array of objects
- **Required**: Yes (if any images were found in source PDFs)
- **Purpose**: Central catalog of ALL visual assets extracted from source PDFs
- **Object structure**: See `VISUAL_MAPPING_GUIDE.md` for full specification
- **Key fields**: `visual_id`, `source_pdf`, `source_page`, `asset_type`, `title`, `alt_text`, `subtitle`, `tags`, `placeholderColor`, `placeholderIcon`, `section_id`, `ai_generated`
- **Feeds**: Visual asset rendering, accessibility alt text, content audit

---

## SECTION-LEVEL FIELDS

### sections[]
- **Type**: array of objects
- **Required**: Yes
- **Count**: 8–14 sections per module (varies by content volume)
- **Section `kind`**: Always `"Reading"` for Materi domain

Each section object:

```
section
├── id                  [string, REQUIRED]
├── title               [string, REQUIRED]
├── kind                [string, REQUIRED] — always "Reading"
├── summary             [string, REQUIRED]
├── content[]           [array of objects, REQUIRED]
├── bullets[]           [array of objects, REQUIRED]
├── callouts[]          [array of objects, REQUIRED]
├── visual_refs[]       [array of strings, REQUIRED — empty [] if no images]
├── glossary_refs[]     [array of strings, REQUIRED — empty [] if none]
├── quiz_refs[]         [array of strings, REQUIRED — empty [] initially]
├── bilingual           [object, REQUIRED]
└── ai_additions[]      [array of objects, REQUIRED — empty [] if no AI additions]
```

---

### Section `id`
- **Type**: string
- **Required**: Yes
- **Format**: `s[zero-padded-2-digit-number]`
- **Examples**: `"s01"`, `"s02"`, `"s11"`, `"s22"`
- **Rules**: Sequential within a module. Cross-batch continuity per `BATCH_PROCESSING_GUIDE.md`. No reuse of IDs within a module.
- **Feeds**: Section navigation, deep-link routing

---

### Section `title`
- **Type**: string
- **Required**: Yes
- **Format**: Title Case, English, topic-specific
- **Example**: `"Pathophysiology — Ischemic Cascade"`
- **Rules**: 3–8 words. May use em dash (—) to separate main topic and subtopic. Should be distinct from all other section titles in the module.
- **Feeds**: Section header (S9 and S10 screens), table of contents

---

### Section `kind`
- **Type**: string (enum)
- **Required**: Yes
- **Value**: Always `"Reading"` for Materi domain
- **Feeds**: Study session type routing

---

### Section `summary`
- **Type**: string
- **Required**: Yes
- **Language**: Bahasa Indonesia
- **Length**: 1–2 sentences (40–80 words)
- **Content**: Distilled essence of the section — the single most important takeaway
- **Feeds**: Section preview card, study mode orientation

---

### `content[]`
- **Type**: array of paragraph objects `{ "text": "..." }`
- **Required**: Yes
- **Count**: 3–5 paragraph objects per section
- **Screen mapping**: S9 (Reading screen) — full prose paragraphs

**Content paragraph rules:**
- Each `{ "text": "..." }` is one standalone paragraph
- 80–150 words per paragraph
- Complete sentences — no dangling phrases
- No markdown inside content text (no `**bold**`, no `- bullets`)
- Paragraph 1: Core concept + clinical significance (source-faithful)
- Paragraph 2: Mechanism or pathophysiology (AI enrichment welcome)
- Paragraph 3: Clinical presentation, diagnosis, or management
- Paragraph 4 (optional): Complications or special considerations
- Paragraph 5 (optional): Evidence-based guidelines, key trials
- Language: English preferred in content paragraphs (bilingual app uses English for academic content)

---

### `bullets[]`
- **Type**: array of bullet objects
- **Required**: Yes
- **Count**: 4–6 bullet objects per section
- **Screen mapping**: S10 (Bullets/Study Points screen)

**Bullet object structure:**
```json
{
  "text": "Main bullet statement — exam-ready, specific",
  "sub": ["supporting detail 1", "supporting detail 2", "supporting detail 3"],
  "tone": "ok"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | Yes | Main point. 1–2 sentences. Concise and exam-relevant. Include numbers/thresholds. |
| `sub` | array of strings | Optional | 2–4 sub-items. Supporting data, comparisons, clinical nuance. |
| `tone` | string | Optional | Rendering hint. Values: `"ok"` (green/positive), `"warn"` (yellow/caution), `"danger"` (red/critical). Omit for neutral. |

**Tone usage guide:**
- `"ok"`: Normal finding, positive prognostic sign, correct approach
- `"warn"`: Important clinical caution, common error to avoid, watch-out threshold
- `"danger"`: Life-threatening emergency, absolute contraindication, critical safety point

---

### `callouts[]`
- **Type**: array of callout objects
- **Required**: Yes
- **Count**: 3–5 callout objects per section
- **Screen mapping**: S9 and S10 screens (rendered as highlighted boxes)

**Callout object structure:**
```json
{
  "tone": "exam_pearl",
  "title": "Descriptive callout title",
  "text": "2–4 sentence callout body..."
}
```

| `tone` value | Purpose | When to use |
|---|---|---|
| `"exam_pearl"` | MCQ/OSCE-relevant pattern | Specific threshold, diagnostic criteria, mnemonic, exam trap |
| `"clinical_pearl"` | Bedside clinical insight | Practical tip, diagnostic shortcut, patient safety note |
| `"warning"` | Safety-critical information | Contraindication, common fatal error, do-not-miss finding |
| `"teaching_point"` | Conceptual explanation | Mechanism insight, "why" behind a clinical fact, common misconception corrected |

**Callout quality rules:**
- `title`: 4–8 words, descriptive and specific — "Mnemonik ABCD² untuk TIA Risk" not "Important Point"
- `text`: 2–4 sentences. Actionable and specific. Include exact values where relevant.
- Each callout tone should appear at least once per section (aim for variety)

---

### `visual_refs[]`
- **Type**: array of strings (visual_ids)
- **Required**: Yes (use empty `[]` if no images in section)
- **Format**: `["visual_id_01", "visual_id_02"]`
- **Rules**: Each entry must have a corresponding entry in `visual_asset_manifest[]`. Only include visuals that were physically present in the PDF pages covering this section's topic.
- **Feeds**: S9 (embedded visual display), S4 (Visual Gallery screen)

---

### `glossary_refs[]`
- **Type**: array of strings (term IDs)
- **Required**: Yes (use empty `[]` if no terms apply)
- **Format**: Snake_case version of `term` from module-level `glossary[]`
- **Example**: `["stroke_iskemik", "nihss", "tpa_alteplase", "lvo"]`
- **Rules**: Only reference terms that are actually defined in the module's `glossary[]`. IDs are generated by converting the term to lowercase and replacing spaces with underscores.
- **Feeds**: In-text term highlighting and popup, Glossary screen cross-reference

---

### `quiz_refs[]`
- **Type**: array of strings (quiz question IDs)
- **Required**: Yes (use empty `[]` initially — populated when quiz content is added)
- **Format**: `["q_tPA_indication", "q_NIHSS_interpretation"]`
- **Rules**: Leave as empty `[]` on initial module.json generation. Quiz IDs are added in a separate pipeline.
- **Feeds**: S11 (Quiz screen) cross-reference

---

### Section `bilingual`
- **Type**: object (NOT an array — one object per section)
- **Required**: Yes
- **Structure**: Same bilingual tier pattern as module-level bilingual entries, but scoped to the section topic

```json
{
  "concept": "Section topic in 2–3 words (Indonesian)",
  "simple_id": "...",
  "simple_id_note": "...",
  "bilingual_id": "...",
  "bilingual_en": "...",
  "medical_id": "..."
}
```

Note: Section-level bilingual does NOT require `title`, `medical_note` fields (those are optional and appear only in module-level bilingual entries for featured concepts).

- **Feeds**: S8 (Bilingual screen) section-specific content

---

### `ai_additions[]`
- **Type**: array of tracking objects
- **Required**: Yes (use empty `[]` if section has zero AI additions)
- **Purpose**: Audit trail tracking which content is AI-generated vs source-extracted
- **Object structure**:
```json
{
  "location": "content[1]",
  "type": "pathophysiology_expansion | guideline_addition | mechanism_detail | clinical_context | mnemonic | AI_only_section | contradiction_resolved",
  "source_basis": "Harrison's Principles Chapter X | WHO Guidelines 2023 | DAWN Trial | etc.",
  "text_preview": "First 10–12 words of the added text to identify it..."
}
```

| `type` value | Description |
|---|---|
| `pathophysiology_expansion` | AI-added mechanism detail beyond what source provides |
| `guideline_addition` | Specific guideline recommendation added from AI knowledge |
| `mechanism_detail` | Molecular/cellular mechanism detail not in source |
| `clinical_context` | Clinical application context added by AI |
| `mnemonic` | AI-generated mnemonic or memory aid |
| `AI_only_section` | Entire section is AI-generated (no source coverage) |
| `contradiction_resolved` | AI resolved conflicting information across source PDFs |

---

## FIELD COMPLETENESS REQUIREMENTS

### Always Required (null not acceptable)
`id`, `title`, `subtitle`, `domain`, `batch_id`, `source_pdf`, `source_filename`, `topicTags`, `summary`, `exam_focus`, `glossary`, `bilingual`, `sections`, all section fields except `quiz_refs`

### Required-but-can-be-empty-array
`quiz_refs[]` → `[]`
`visual_refs[]` → `[]` (only if truly no images in section)
`glossary_refs[]` → `[]` (only if no glossary terms apply)
`ai_additions[]` → `[]` (only if section is 100% source-extracted)
`visual_asset_manifest[]` → `[]` (only if no images found in entire batch)

### Optional
`simple_id_note` (bilingual), `medical_note` (bilingual), bullet `tone` field, `sub` array in bullets

---

## SURFACE MAPPING QUICK REFERENCE

| Screen | Code | Content source |
|---|---|---|
| Module Overview | S1 | `summary[]`, `topicTags[]`, `exam_focus[]` |
| Exam Focus | S2 | `exam_focus[]` |
| Table of Contents | S3 | all `section.title` values |
| Visual Gallery | S4 | `visual_asset_manifest[]` |
| Reading | S9 | `section.content[]`, `section.callouts[]`, `section.visual_refs[]` |
| Study Points | S10 | `section.bullets[]`, `section.callouts[]` |
| Glossary | S7 | `glossary[]` |
| Bilingual | S8 | `bilingual[]` (module-level), `section.bilingual` |
| Quiz | S11 | `quiz_refs[]` (populated separately) |

---

## QUALITY STANDARDS SUMMARY

| Field | Min Length | Max Length | Language |
|---|---|---|---|
| `summary[]` item | 50 chars | 200 chars | Bahasa Indonesia |
| `exam_focus[]` item | 30 chars | 150 chars | Mixed ID/EN |
| `glossary[].meaning` | 200 chars | 600 chars | Bahasa Indonesia |
| `simple_id` | 80 chars | 300 chars | Bahasa Indonesia (simple) |
| `bilingual_id` | 200 chars | 600 chars | Bahasa Indonesia (academic) |
| `bilingual_en` | 200 chars | 600 chars | English (academic) |
| `medical_id` | 300 chars | 800 chars | Bahasa Indonesia (specialist) |
| `content[].text` | 300 chars | 700 chars | English (academic) |
| `bullets[].text` | 40 chars | 200 chars | Mixed ID/EN |
| `callouts[].text` | 100 chars | 500 chars | Mixed ID/EN |
| Section `summary` | 80 chars | 300 chars | Bahasa Indonesia |

---

*CORTEX-SHELL Schema Reference v1.0 — derived from mod_neuro_stroke_001 production module*
*Update this document whenever the schema is changed in production.*
