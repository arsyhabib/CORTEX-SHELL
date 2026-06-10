# CONTENT_SCHEMA_MASTER.md
# CORTEX-SHELL — Master Schema Reference (All Content Domains)
# Version: 2.0 | Permanent Anchor File | Batch 4
# Date: 2026-06-10

---

## PURPOSE

This document is the single source of truth for all JSON content schemas used by CORTEX-SHELL.
Any AI agent generating content for this platform MUST read this document before producing output.

Two content domains exist:
- **MATERI** — Lecture learning modules → `module.json`
- **SOAL** — Exam question sets → `exam_set.json`

Both are registered in `app_data/runtime/content_index.kimi.json`.

---

## PART A — MODULE.JSON SCHEMA (MATERI DOMAIN)

### File Location Pattern
```
app_data/domains/materi/modules/[module_id]/module.json
```

### Top-Level Structure
```json
{
  "id": "mod_[domain]_[topic_slug]_[NNN]",
  "title": "Clinical Topic Name",
  "subtitle": "Short descriptive subtitle",
  "domain": "neuro_emergency",
  "batch_id": "batch_1",
  "source_pdf": "original_filename.pdf",
  "source_filename": "original_filename.pdf",
  "topicTags": ["Tag1", "Tag2"],
  "summary": ["Key point 1.", "Key point 2."],
  "exam_focus": ["High-yield fact 1.", "High-yield fact 2."],
  "glossary": [...],
  "bilingual": [...],
  "visual_asset_manifest": [...],
  "ai_additions": [...],
  "sections": [...]
}
```

### Module-Level Field Rules

| Field | Type | Required | Rules |
|---|---|---|---|
| `id` | string | YES | Format: `mod_[domain]_[slug]_[NNN]`. Lowercase, underscores only. Unique across ALL modules. |
| `title` | string | YES | 2–6 words, Title Case, English. Clinical topic name, no "Introduction to". |
| `subtitle` | string | YES | 1 sentence, English. Expands on title. |
| `domain` | string | YES | Matches domain ID in content_index (e.g. `neuro_emergency`). |
| `batch_id` | string | YES | Format: `batch_[N]`. Tracks which processing batch generated this module. |
| `source_pdf` | string | YES | Original PDF filename. Used for traceability. |
| `topicTags` | string[] | YES | 4–10 keyword tags. Used by search. Title Case. |
| `summary` | string[] | YES | 5–10 sentences. Module-level key takeaways. Feeds S11 Summary surface. |
| `exam_focus` | string[] | YES | 5–10 high-yield exam facts. Feeds S12 Exam Tips surface. |
| `glossary` | object[] | YES | Medical terms. See Glossary Object schema below. |
| `bilingual` | object[] | OPTIONAL | Bahasa Indonesia translations/simplifications. |
| `visual_asset_manifest` | object[] | CONDITIONAL | Required if any images found in source PDFs. |
| `ai_additions` | object[] | OPTIONAL | Tracks the 40% AI-researched content. See AI Additions schema. |
| `sections` | object[] | YES | 6–12 sections. Core content. See Section schema. |

---

### GLOSSARY OBJECT SCHEMA

```json
{
  "id": "gls_[module_short]_[term_slug]",
  "term": "Term Name",
  "def": "Definition in 1–3 sentences.",
  "type": "mechanism | anatomy | drug | clinical | procedure | score",
  "aliases": ["alternate name", "abbreviation"]
}
```

Rules:
- `id` must be unique within the module
- `type` must be one of the 6 enum values above
- `aliases[]` is optional but strongly recommended for acronyms
- Every term referenced in `sections[].glossary_refs[]` must have an entry here

---

### SECTION OBJECT SCHEMA

```json
{
  "id": "s01",
  "title": "Section Title",
  "summary": "1–2 sentence section summary.",
  "estimated_time_minutes": 15,
  "content": [...],
  "bullets": [...],
  "callouts": [...],
  "visual_refs": [...],
  "glossary_refs": [...],
  "bilingual": "Optional Bahasa explanation of section focus."
}
```

#### Section ID Rules
- Format: `s` + 2-digit zero-padded index: `s01`, `s02`, ... `s11`
- Must be sequential and unique within the module
- Do NOT skip IDs

#### content[] Object
```json
{
  "text": "Paragraph text. Full sentences. 3–8 sentences per block.",
  "tone": "narrative | clinical | mechanism | evidence",
  "source": "optional: PDF slide reference or external source"
}
```

#### bullets[] Object
```json
{
  "text": "Bullet point text. 1–2 sentences.",
  "sub": ["Sub-bullet 1", "Sub-bullet 2"],
  "bold": true,
  "source": "optional source"
}
```

#### callouts[] Object — CRITICAL
```json
{
  "tone": "pearl | evidence | note | caution | danger",
  "icon": "💡",
  "title": "Short callout title",
  "text": "Callout body text. Clinical relevance.",
  "answer_evidence": "Source: Author et al. (Year) or Guideline Name"
}
```

**Tone vocabulary (STRICT — use only these 5 values):**

| tone | Usage | App Display |
|---|---|---|
| `pearl` | Clinical pearl, exam tip, memory aid | Green highlight |
| `evidence` | Evidence-based statement with citation | Teal highlight |
| `note` | Teaching point, clarification, explanation | Blue highlight |
| `caution` | Warning, requires monitoring | Gold/yellow highlight |
| `danger` | Red flag, contraindication, emergency | Red highlight |

**LEGACY TONES — normalize these on input:**

| Legacy Input | → | Normalize To |
|---|---|---|
| `clinical_pearl` | → | `pearl` |
| `exam_pearl` | → | `evidence` |
| `teaching_point` | → | `note` |
| `warning` | → | `danger` |
| `radiology_pearl` | → | `evidence` |

**Quality Gate:** At least 60% of callouts must have `answer_evidence` populated.

#### visual_refs[] Object
```json
{
  "id": "visual_[module_short]_[descriptor]_[N]",
  "type": "diagram | radiograph | photo | chart | table | flowchart | microscopy | anatomy_3d | illustration | screenshot",
  "src": "app_data/domains/materi/modules/[module_id]/assets/[filename].png",
  "alt": "Detailed alt text for screen readers and AI processing.",
  "caption": "Short display caption shown under the image.",
  "source_slide": 14,
  "clinical_relevance": "Why this image matters clinically.",
  "needs_generation": true
}
```

`needs_generation: true` = image must be AI-generated (not supplied from PDF). Set `false` if image is being supplied directly.

#### glossary_refs[] Array
```json
["gls_neuro_nihss", "gls_neuro_tpa", "gls_neuro_penumbra"]
```
Array of glossary term IDs. Every ID listed here must exist in `module.glossary[]`.

---

### AI_ADDITIONS OBJECT SCHEMA

Tracks all 40% AI-researched content (not from source PDFs).

```json
{
  "section_id": "s05",
  "type": "content | bullet | callout | glossary | summary | exam_focus",
  "source_query": "What is the mechanism of tPA in acute ischemic stroke?",
  "source_reference": "AHA/ASA 2019 Guidelines for Early Management of Acute Ischemic Stroke",
  "confidence": "high | medium | low",
  "note": "Optional: why this was added and how it complements PDF content"
}
```

**Content Ratio Rule:**
- 60% of all content must be traceable to source PDF pages
- 40% may be AI-researched from authoritative sources (guidelines, textbooks, journals)
- Every AI addition MUST be logged in `ai_additions[]`

---

### VISUAL_ASSET_MANIFEST OBJECT SCHEMA

```json
{
  "id": "visual_[module_short]_[descriptor]_[N]",
  "module_id": "mod_neuro_stroke_001",
  "section_id": "s03",
  "type": "diagram | radiograph | anatomy_3d | chart | flowchart | microscopy | table | illustration | photo | screenshot | reference_card",
  "generation_prompt": "Detailed AI image generation prompt. Include: subject, style, labels, colors, clinical accuracy requirements.",
  "alt": "Full alt text description.",
  "status": "pending | generated | approved | replaced",
  "src": "app_data/domains/materi/modules/[module_id]/assets/[filename].png"
}
```

---

## PART B — EXAM_SET.JSON SCHEMA (SOAL DOMAIN)

### File Location Patterns
```
Exam Asli:    app_data/domains/soal/exam_asli/[exam_id].json
Bank Soal AI: app_data/domains/soal/bank_soal_ai/[exam_id].json
```

### Top-Level Structure
```json
{
  "exam_id": "set_asli_NN",
  "title": "Ujian Akhir Blok Neurologi 2025",
  "type": "asli",
  "subject": "Neurologi Klinis",
  "year": "2025",
  "questions": [...],
  "metadata": {...}
}
```

### Top-Level Field Rules

| Field | Type | Required | Rules |
|---|---|---|---|
| `exam_id` | string | YES | `set_asli_NN` or `bank_soal_ai_NN`. Must match the `id` registered in content_index. |
| `title` | string | YES | Indonesian for asli (e.g., "Ujian Akhir Blok Neurologi 2025"). English/mixed for ai_generated. |
| `type` | string | YES | Enum: `"asli"` or `"ai_generated"` ONLY. |
| `subject` | string | YES | Medical block/subject (e.g., `"Neurologi Klinis"`, `"Kardiologi"`). |
| `year` | string | YES | 4-digit year string. For ai_generated, use generation year. |
| `questions` | object[] | YES | Array of question objects. Must not be empty. Minimum 10 questions per set. |
| `metadata` | object | YES | Batch processing metadata block. See schema below. |

---

### QUESTION OBJECT SCHEMA

```json
{
  "number": 1,
  "stem": "Full question text. Clinical vignette format preferred. 2–5 sentences.",
  "options": [
    "Option A text",
    "Option B text",
    "Option C text",
    "Option D text"
  ],
  "answer_index": 0,
  "explanation": "Why the correct answer is correct. Why distractors are wrong. 3–6 sentences.",
  "confidence": "definite | probable | uncertain",
  "answer_evidence": "Source citation or guideline reference.",
  "topic_tags": ["Tag1", "Tag2"],
  "difficulty": "easy | medium | hard"
}
```

#### Question Field Rules

| Field | Type | Required | Rules |
|---|---|---|---|
| `number` | integer | YES | Sequential starting from 1. |
| `stem` | string | YES | Full question text. Do NOT abbreviate. Clinical vignette preferred. |
| `options` | string[4] | YES | EXACTLY 4 options. Index 0=A, 1=B, 2=C, 3=D. All options must be plausible. |
| `answer_index` | integer | YES | 0-based index of correct option (0–3). |
| `explanation` | string | YES | 3–6 sentences. Explain correct answer + why each distractor is wrong. |
| `confidence` | string | YES | For asli: always `"definite"`. For ai_generated: `"definite"`, `"probable"`, or `"uncertain"`. |
| `answer_evidence` | string | RECOMMENDED | Citation. Required for all `"definite"` confidence questions. |
| `topic_tags` | string[] | OPTIONAL | 2–4 topic keywords for cross-referencing with modules. |
| `difficulty` | string | OPTIONAL | `"easy"`, `"medium"`, or `"hard"`. |

#### CRITICAL: Answer Index Rules
```
"options": ["A text", "B text", "C text", "D text"]
              ↑           ↑           ↑           ↑
           index 0     index 1     index 2     index 3

"answer_index": 0  → Correct answer is "A text"
"answer_index": 2  → Correct answer is "C text"
```

NEVER use 1-based indexing. NEVER use letter strings like `"A"` or `"B"` as `answer_index`.

---

### METADATA OBJECT SCHEMA

```json
{
  "metadata": {
    "batch_id": "batch_1",
    "source_pdf": "original_exam_filename.pdf",
    "extraction_method": "vision_ocr | text_extraction | manual",
    "total_questions": 40,
    "processed_at": "2026-06-10",
    "agent_notes": "Any processing notes or flags from the extracting agent."
  }
}
```

---

## PART C — CONTENT_INDEX.KIMI.JSON REGISTRATION

After generating ANY module.json or exam_set.json, the file MUST be registered in:
```
app_data/runtime/content_index.kimi.json
```

### Registration Format for New Module

Add to `lectureDomains[matching_domain].modules[]`:
```json
{
  "id": "mod_[domain]_[slug]_[NNN]",
  "title": "Module Title",
  "sourceFile": "app_data/domains/materi/modules/[module_id]/module.json",
  "topicTags": ["Tag1", "Tag2"],
  "status": "active",
  "domainId": "[domain_id]",
  "order": 2,
  "batchId": "batch_N",
  "estimatedTimeMinutes": 180,
  "sectionCount": 10,
  "wordCount": 7500
}
```

Also increment `lectureModuleCount` and domain's `moduleCount`.

### Registration Format for New Exam Set

Add to `examSets[]`:
```json
{
  "id": "set_asli_NN",
  "title": "Exam Set Title",
  "type": "asli",
  "questionCount": 40,
  "sourceFile": "app_data/domains/soal/exam_asli/[exam_id].json",
  "source_label": "Univ / Block Name"
}
```

Also increment `examSetCount` and `examQuestionCount`.

---

## PART D — VISUAL_ASSET_MANIFEST REGISTRATION

After identifying ANY image/diagram in source PDFs, add an entry to:
```
app_data/runtime/visual_asset_manifest.generated.json
```

```json
{
  "id": "visual_neuro_ischemic_cascade_01",
  "module_id": "mod_neuro_stroke_001",
  "section_id": "s03",
  "type": "diagram",
  "generation_prompt": "Create a clean medical education diagram of the ischemic cascade...",
  "alt": "Flowchart showing: ATP depletion → Na/K pump failure → glutamate release → calcium influx → cell death",
  "status": "pending",
  "src": "app_data/domains/materi/modules/mod_neuro_stroke_001/assets/ischemic_cascade.png"
}
```

**Visual ID Naming Convention:**
```
visual_[module_short]_[descriptor]_[sequential_N]

Examples:
  visual_neuro_ischemic_cascade_01
  visual_cardio_ecg_stemi_01
  visual_pharmaco_receptor_map_01
  visual_neuro_nihss_table_01
```

No two entries across ALL modules may share the same `id`.

---

## PART E — SURFACE CONSUMPTION MAP

Which app surfaces consume which JSON fields:

| Surface | Component | Key Fields Read |
|---|---|---|
| S3 PageLearning | Section list nav | `module.sections[].title`, `.summary`, `.content[0].text`, `.callouts[0]`, `.glossary_refs` |
| S4 PageSlideDetail | Chapter nav | `module.sections[].title`, `.estimated_time_minutes` |
| S5 PageLearningContent | Full reader | `module.sections[]` — all fields |
| S6 PageSearch | Search results | `contentIndex.lectureDomains[].modules[].title`, `.topicTags`; `contentIndex.examSets[].title` |
| S9 PageModuleIntro | Hero card | `module.title`, `.subtitle`, `.domain`, `.topicTags`, `.summary[0]` |
| S10 PageModuleLearn | Section reader | `module.sections[].content[]`, `.callouts[]`, `.visual_refs[]`, `.glossary_refs[]` |
| S11 PageModuleSummary | Summary list | `module.summary[]` |
| S12 PageModuleExam | Exam tips | `module.exam_focus[]` |
| S13 PageModuleVisual | Image gallery | `module.visual_asset_manifest[]` |
| S14 PageModuleGlossary | Term list | `module.glossary[]` |
| S15 PageModuleBilingual | Bilingual | `module.bilingual[]`, `sections[].bilingual` |
| S16 PageModuleProgress | Progress | `module.sections[].id`, `.title`, `.estimated_time_minutes` |
| S17 PageQuiz | Quiz engine | `examSet.questions[]` — all fields |
| S18 PageFlashcard | Flip cards | `module.glossary[]` (front mode); `examSet.questions[]` (exam mode) |
| S22 PageQuickRefModal | Pearl list | `module.sections[].callouts[]` where `tone` in {pearl, evidence, caution, danger} |

---

## PART F — SCHEMA VALIDATION QUICK REFERENCE

Before submitting any generated JSON, verify ALL of the following:

### module.json Checklist
- [ ] `id` is unique, follows `mod_[domain]_[slug]_[NNN]` format
- [ ] `sections[]` has 6–12 entries with sequential `s01`–`sNN` IDs
- [ ] Every ID in `glossary_refs[]` has a matching entry in `module.glossary[]`
- [ ] Callout `tone` values use ONLY: `pearl`, `evidence`, `note`, `caution`, `danger`
- [ ] At least 60% of callouts have `answer_evidence` populated
- [ ] `summary[]` has 5–10 string entries
- [ ] `exam_focus[]` has 5–10 string entries
- [ ] All non-PDF content logged in `ai_additions[]`
- [ ] Content ratio is approximately 60% PDF-sourced / 40% AI-researched
- [ ] File registered in `content_index.kimi.json`
- [ ] All identified images registered in `visual_asset_manifest.generated.json`

### exam_set.json Checklist
- [ ] `exam_id` follows `set_asli_NN` or `bank_soal_ai_NN` naming
- [ ] `type` is exactly `"asli"` or `"ai_generated"` (no other values)
- [ ] Every question has EXACTLY 4 options
- [ ] `answer_index` is an integer 0–3 (not a letter, not 1-based)
- [ ] Every question has `explanation` (3–6 sentences)
- [ ] At least 80% of questions have `answer_evidence`
- [ ] `metadata` block is complete with `batch_id`, `source_pdf`, `processed_at`
- [ ] File registered in `content_index.kimi.json`
- [ ] `examSetCount` and `examQuestionCount` updated in content_index

---

## PART G — ID ALLOCATION TABLES

Use these ranges to prevent ID collisions across batches:

### Module ID Ranges
| Batch | Module ID Range |
|---|---|
| Batch 1 (demo) | `mod_*_001` |
| Batch 2 | `mod_*_002` – `mod_*_011` |
| Batch 3 | `mod_*_012` – `mod_*_021` |
| Batch 4 | `mod_*_022` – `mod_*_031` |

### Exam Set ID Ranges
| Type | Batch | ID Range |
|---|---|---|
| Exam Asli | Batch 1 | `set_asli_01` – `set_asli_03` |
| Exam Asli | Batch 2 | `set_asli_04` – `set_asli_06` |
| Bank Soal AI | Batch 1 | `bank_soal_ai_01` – `bank_soal_ai_05` |
| Bank Soal AI | Batch 2 | `bank_soal_ai_06` – `bank_soal_ai_10` |

### Visual Asset ID Ranges
| Module Short | Starting N |
|---|---|
| `neuro` | 01 |
| `cardio` | 01 |
| `pharmaco` | 01 |
| `anatomy` | 01 |
| Rule | Each module starts from `_01` — use module prefix to avoid collision |

---

*This document supersedes all partial schema references in individual package guides.*  
*Ground truth example: `app_data/domains/materi/modules/mod_neuro_stroke_001/module.json`*  
*Last updated: 2026-06-10 | Batch 4 Anchor*
