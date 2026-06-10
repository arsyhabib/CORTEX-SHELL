# SCHEMA REFERENCE: exam_set.json
**Version:** 2.0  
**Package:** packages/soal  
**Ground Truth Files:** app_data/demo/exam_asli_01.json, app_data/demo/exam_ai_01.json

---

## OVERVIEW

`exam_set.json` is the canonical data format for all exam content in CORTEX-SHELL. It is consumed by:
- **Surface 17 (Quiz)** — renders question stem, four answer options, post-answer explanation
- **Surface 18 (Flashcard)** — renders individual question-answer pairs as flip cards

Every exam set, whether sourced from authentic university exams (exam_asli) or AI-generated question banks (bank_soal_ai), uses the same JSON schema with minor field-level differences noted below.

---

## TOP-LEVEL STRUCTURE

```json
{
  "exam_id": "set_asli_01",
  "title": "Ujian Blok Neurology (Asli)",
  "type": "asli",
  "subject": "Neurologi Klinis",
  "year": "2025",
  "questions": [...],
  "metadata": {...}
}
```

### Top-Level Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `exam_id` | string | Yes | Unique identifier. Naming convention: `set_asli_NN` or `bank_soal_ai_NN`. Must match the `id` registered in `content_index.kimi.json`. |
| `title` | string | Yes | Human-readable title. Use Indonesian for exam_asli (e.g., "Ujian Akhir Blok Neurologi 2025"). Use English/mixed for bank_soal_ai. |
| `type` | string | Yes | Either `"asli"` or `"ai_generated"`. This field determines the confidence label vocabulary and display behavior in the app. |
| `subject` | string | Yes | The medical subject or block (e.g., `"Neurologi Klinis"`, `"Kardiologi"`, `"Farmakologi Dasar"`). |
| `year` | string | Yes | The exam year as a 4-digit string (e.g., `"2025"`). For bank_soal_ai, use the generation year. |
| `questions` | array | Yes | Array of question objects. See question schema below. Must not be empty. |
| `metadata` | object | Yes | Batch processing metadata. See metadata schema below. |

---

## QUESTION OBJECT SCHEMA

Each entry in the `questions[]` array represents one exam question.

### Minimal Valid Question (exam_asli example)

```json
{
  "number": 1,
  "stem": "Seorang pasien laki-laki usia 45 tahun mengeluhkan kelemahan mendadak pada lengan kanan dan kesulitan memproduksi kata-kata. Di area manakah kemungkinan lesi terjadi?",
  "options": [
    "Area Broca (Lobus Frontalis Kiri)",
    "Area Wernicke (Lobus Temporalis Kiri)",
    "Gyrus Precentralis Kiri",
    "Lobus Occipitalis Kiri"
  ],
  "answer_index": 0,
  "explanation": "Lesi pada Area Broca menyebabkan afasia motorik (non-fluent aphasia), di mana pasien memahami pembicaraan tetapi mengalami kesulitan memproduksi kata-kata secara verbal.",
  "confidence": "High-Yield",
  "answer_evidence": "Neurologi Klinis — Bab Afasia"
}
```

### Full Question Object (all optional fields included)

```json
{
  "number": 12,
  "stem": "Perhatikan gambaran EKG berikut ini. [IMAGE DESCRIPTION — ECG]: Sinus rhythm ~75 bpm. ST elevation 3mm di leads II, III, aVF. Reciprocal depression di I dan aVL. Pasien laki-laki 58 tahun dengan nyeri dada mendadak. Diagnosis yang paling tepat adalah?",
  "options": [
    "Inferior STEMI",
    "Anterior STEMI",
    "NSTEMI",
    "Unstable Angina"
  ],
  "answer_index": 0,
  "explanation": "Gambaran ST elevation di inferior leads (II, III, aVF) dengan reciprocal change di lateral leads menunjukkan inferior STEMI, yang umumnya akibat oklusi arteri koroner kanan (RCA).",
  "confidence": "Clinical Reasoning",
  "answer_evidence": "Printed answer key, page 8 — Q12: A",
  "topic_tags": ["Kardiologi", "STEMI", "EKG", "Diagnosis"],
  "difficulty": "sedang",
  "image_ref": "image_ecg_q12_batch01",
  "needs_visual_asset": true
}
```

### Question Field Definitions

| Field | Type | Required | Notes |
|---|---|---|---|
| `number` | integer | Yes | Question number as it appears in the source PDF. Must be sequential and unique within the file. |
| `stem` | string | Yes | Full question text. For vignette-based questions, include the entire clinical scenario. Do not truncate. For image-based questions, prepend a text description of the image inside `[IMAGE DESCRIPTION — type]:` brackets. |
| `options` | array of strings | Yes | Exactly 4 strings for standard questions. Strings are ordered A, B, C, D (index 0, 1, 2, 3). If source has 5 options, include 5 strings and set `has_five_options: true` in metadata. |
| `answer_index` | integer or null | Yes | 0-indexed position of the correct answer in `options[]`. 0=A, 1=B, 2=C, 3=D. Set to `null` only when no answer key is available. |
| `explanation` | string | Yes | Clinical explanation for why the answer is correct. Must be substantive — minimum 20 words. Do not use generic placeholder text. If explanation must be reconstructed, mark `answer_evidence` accordingly. |
| `confidence` | string | Yes | Category tag. Allowed values differ by `type` — see Confidence Categories section below. |
| `answer_evidence` | string | Yes | Source of the answer (where the correct answer was found). Examples: `"Printed answer key, page 8"`, `"Neurologi Klinis — Bab Afasia"`, `"Explanation reconstructed from medical knowledge"`. |
| `topic_tags` | array of strings | Recommended | 2–4 topic tags in Indonesian medical terminology. Used for filtering and flashcard grouping. |
| `difficulty` | string | Recommended | One of `"mudah"`, `"sedang"`, `"sulit"`. |
| `image_ref` | string | Conditional | Set when the question contains an embedded image. Use the naming convention `image_[type]_q[number]_[batch_id]`. Required if `needs_visual_asset` is true. |
| `needs_visual_asset` | boolean | Conditional | Set `true` when `image_ref` is present. Signals to content team that a visual asset needs to be sourced or generated. |

---

## METADATA OBJECT SCHEMA

```json
"metadata": {
  "source_pdf": ["exam_neuro_2025_p1.pdf", "exam_neuro_2025_p2.pdf"],
  "batch_id": "exam_asli_batch_01",
  "total_questions": 50,
  "processed_date": "2026-06-10",
  "agent_version": "soal_vision_agent_v2",
  "has_image_questions": true,
  "validation_flags": [
    "Q23: answer_index null — no answer key found for this question",
    "Q41: OCR reconstruction applied — verify against original PDF"
  ],
  "notes": [
    "PDF 2 was fully image-based — OCR applied to all 20 pages",
    "Handwritten annotations detected on pages 3 and 7 of PDF 1"
  ]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `source_pdf` | array of strings | Yes | Original PDF filenames, in the order they were processed. |
| `batch_id` | string | Yes | Batch identifier following the naming convention in BATCH_PROCESSING_GUIDE.md. |
| `total_questions` | integer | Yes | Total number of questions in this exam_set.json. Must match `questions[].length`. |
| `processed_date` | string | Yes | ISO date (YYYY-MM-DD) when the batch was processed. |
| `agent_version` | string | Yes | Version tag of the agent that produced this file. |
| `has_image_questions` | boolean | No | Set `true` if any question has `needs_visual_asset: true`. |
| `validation_flags` | array of strings | No | List of issues found during Phase 4 validation. Empty array if no issues. |
| `notes` | array of strings | No | Free-text notes about the batch, e.g., scan quality, annotation presence. |

---

## CONFIDENCE CATEGORIES

### For type: "asli" (exam_asli)

These values are standardized category labels for authentic exam questions.

| Value | Indonesian Label | When to Apply |
|---|---|---|
| `"High-Yield"` | Sering keluar ujian | Classic, high-frequency concept that appears across multiple exam sets |
| `"Kunci"` | Soal kunci | Direct factual recall; straightforward answer key match; foundational knowledge |
| `"Clinical Reasoning"` | Penalaran Klinis | Multi-step reasoning from a clinical vignette to a diagnosis or management decision |
| `"Patofisiologi"` | Patofisiologi | Mechanistic question testing understanding of disease pathophysiology |
| `"Klinis"` | Aplikasi Klinis | Applied clinical management, pharmacology, or procedural question |
| `"Unverified"` | Belum terverifikasi | No answer key available; needs human review before publishing |
| `"Low — OCR artifact"` | OCR artifact | Answer reconstructed due to scan quality; needs verification |

### For type: "ai_generated" (bank_soal_ai)

These values are subject-topic classifier labels, not quality ratings. They describe what the question tests.

The `confidence` field for AI-generated questions uses free-text topic labels. Examples from the demo file:
- `"Eksitasi/Inhibisi"` — questions about excitation/inhibition balance in the nervous system
- `"Sinapsis Kimia"` — questions about chemical synaptic transmission
- `"Klinis"` — clinically applied neuroscience questions
- `"Farmakologi"` — pharmacology-focused questions

These labels are set by the agent during Phase 3 (Classification) and should reflect the specific subtopic of the question.

---

## HOW exam_set.json MAPS TO APP SURFACES

### Surface 17 (Quiz)

The Quiz surface renders questions one at a time. It uses:

| JSON Field | Surface 17 Usage |
|---|---|
| `stem` | Displayed as the question prompt |
| `options[]` | Rendered as 4 tappable answer buttons, labeled A–D |
| `answer_index` | Used to highlight the correct answer after selection |
| `explanation` | Shown in the answer reveal panel below the options |
| `confidence` | Shown as a category badge on the question card |
| `difficulty` | Shown as a difficulty indicator (color-coded) |
| `image_ref` | If present, triggers image display above the stem |

### Surface 18 (Flashcard)

The Flashcard surface renders questions as flip cards. It uses:

| JSON Field | Surface 18 Usage |
|---|---|
| `stem` | Front of the card (question side) |
| `options[answer_index]` | Back of the card (answer side), shown as the correct answer text |
| `explanation` | Shown below the answer on the card back |
| `topic_tags[]` | Used for deck grouping and filtering |
| `confidence` | Used for deck labeling |

---

## questionCount IN content_index.kimi.json

When registering an exam set in `content_index.kimi.json`, the `questionCount` value must equal `metadata.total_questions` in the exam_set.json file, which must equal `questions[].length`.

The top-level `examQuestionCount` in `content_index.kimi.json` is the sum of `questionCount` across all registered exam sets.

```json
"examSets": [
  { "id": "set_asli_01", "questionCount": 2, ... },
  { "id": "bank_soal_ai_01", "questionCount": 3, ... }
],
"examSetCount": 2,
"examQuestionCount": 5
```

Formula: `examQuestionCount = sum of all examSets[].questionCount`

---

## VALIDATION RULES

The following rules must all pass before an exam_set.json is considered valid for production:

1. `exam_id` must be unique across all files registered in `content_index.kimi.json`.
2. `type` must be exactly `"asli"` or `"ai_generated"` — no other values accepted.
3. `questions[]` must not be empty.
4. Every question `number` must be unique within the file and form a continuous sequence starting at 1.
5. Every `options[]` array must have exactly 4 entries (or exactly 5 if `has_five_options: true` in metadata).
6. Every `answer_index` must be an integer 0, 1, 2, or 3 — or `null` only when `confidence` is `"Unverified"`.
7. No `explanation` field may be empty, null, or shorter than 20 words.
8. No two questions in the same file may have identical `stem` values (duplicate check).
9. If `image_ref` is set, `needs_visual_asset` must be `true`.
10. `metadata.total_questions` must equal `questions[].length`.
11. `confidence` must be from the allowed vocabulary for the file's `type` (or a valid topic label for `ai_generated`).
12. The entire file must be syntactically valid JSON (parseable with no errors).

---

## DEMO FILE QUICK REFERENCE

**exam_asli_01.json** (`app_data/demo/exam_asli_01.json`):
- `exam_id`: `"set_asli_01"`
- `type`: implicit asli (set "asli" in new files)
- 2 questions, confidence values: `"High-Yield"`, `"Kunci"`
- No `topic_tags`, `difficulty`, or `metadata` (demo is minimal — new files must be complete)

**exam_ai_01.json** (`app_data/demo/exam_ai_01.json`):
- `exam_id`: `"bank_soal_ai_01"`
- `type`: implicit ai_generated
- 3 questions, confidence values: `"Eksitasi/Inhibisi"`, `"Sinapsis Kimia"`, `"Klinis"`
- Confidence values are topic labels, not quality ratings

When producing new files, always include the full schema including `type`, `subject`, `year`, `topic_tags`, `difficulty`, and `metadata`. The demo files are minimal; new production files must be complete.
