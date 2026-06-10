# BATCH PROCESSING GUIDE — Multi-Batch Exam PDF Compilation
**Version:** 2.0  
**Package:** packages/soal  
**Scope:** Processing up to 5 exam sets across multiple batches

---

## OVERVIEW

When the total number of exam PDFs exceeds the 3-PDF-per-batch limit, or when producing multiple distinct exam sets, the work is divided into batches. This guide defines:
- How to divide PDFs into batches
- Naming conventions for batches and their output files
- How to maintain question numbering continuity across batches
- How to register completed exam sets in `content_index.kimi.json`
- How to handle duplicate questions across multiple exam sets
- How to build a master question bank from compiled batches

---

## BATCH LIMITS AND DIVISION

### Hard Limits Per Batch

- Maximum PDFs per batch: **3**
- Maximum questions per batch: **100** (soft limit — aim for 50–80 for quality output)
- One `exam_set.json` output per batch

### When to Split into Multiple Batches

Split into multiple batches when:
1. The total PDF count for one exam set exceeds 3 (e.g., a 5-part exam printed across 5 PDFs)
2. You are processing multiple distinct exam sets (each set should be a separate batch)
3. A single PDF contains more than ~100 questions (split by section)

Do NOT split by subject or difficulty — always split by source PDF file grouping.

---

## BATCH NAMING CONVENTIONS

### Batch ID Format

```
[type]_batch_[NN]
```

Examples:
- `exam_asli_batch_01` — first authentic exam batch
- `exam_asli_batch_02` — second authentic exam batch
- `bank_soal_ai_batch_01` — first AI-generated bank batch
- `bank_soal_ai_batch_02` — second AI-generated bank batch

`NN` is zero-padded to 2 digits. Batches are numbered sequentially in the order they are processed, not by exam year or topic.

### exam_id Format

Each batch produces one `exam_set.json`. The `exam_id` follows:

```
set_asli_[NN]         (for exam_asli batches)
bank_soal_ai_[NN]     (for bank_soal_ai batches)
```

The `NN` index increments globally across all batches of that type. Check `content_index.kimi.json` to find the next available index before starting a batch.

### Output File Paths

For exam_asli:
```
app_data/domains/exam_asli/exam_sets/set_asli_[NN]/exam_set.json
```

For bank_soal_ai:
```
app_data/domains/bank_soal_ai/question_sets/bank_soal_ai_[NN]/exam_set.json
```

---

## SCENARIO: ONE EXAM SPLIT ACROSS MULTIPLE BATCHES

When a single exam (e.g., a 150-question final exam) is split across multiple batches due to the 3-PDF limit, the following rules apply.

### Question Numbering Continuity

Questions must be numbered continuously across batches to reflect the original exam order.

Example — 150-question exam in 6 PDFs, split into 2 batches:

**Batch 1** (PDFs 1–3, questions 1–75):
- `exam_id`: `"set_asli_03"`
- `metadata.batch_id`: `"exam_asli_batch_03"`
- Question numbers: 1–75
- `metadata.notes`: `["Batch 1 of 2 — questions 1-75 of 150-question exam. Batch 2 will contain questions 76-150."]`

**Batch 2** (PDFs 4–6, questions 76–150):
- `exam_id`: `"set_asli_04"`
- `metadata.batch_id`: `"exam_asli_batch_04"`
- Question numbers: 76–150 (NOT restarted at 1)
- `metadata.notes`: `["Batch 2 of 2 — questions 76-150. Continuation of set_asli_03."]`
- `metadata.continuation_of`: `"set_asli_03"` (add this field to link the batches)

### Merging Split Batches (Post-Processing)

After both batches are produced and validated, a human reviewer or compile agent should:
1. Merge `questions[]` arrays from both files (preserving number order)
2. Update `metadata.total_questions` to the full count
3. Produce a merged file at a canonical path, e.g.:
   ```
   app_data/domains/exam_asli/exam_sets/set_asli_03_merged/exam_set.json
   ```
4. Register the merged file in `content_index.kimi.json` and deprecate the split files.

Use `COMPILE_AUDIT_GUIDE.md` for the merge procedure.

---

## SCENARIO: FIVE DISTINCT EXAM SETS

For processing 5 distinct exam sets (e.g., 5 years of past exam papers):

### Batch Assignment Table (Example)

| Batch ID | exam_id | PDFs Included | Questions |
|---|---|---|---|
| `exam_asli_batch_01` | `set_asli_01` | exam_2021_p1.pdf, exam_2021_p2.pdf | 1–60 |
| `exam_asli_batch_02` | `set_asli_02` | exam_2022_p1.pdf, exam_2022_p2.pdf, exam_2022_p3.pdf | 1–90 |
| `exam_asli_batch_03` | `set_asli_03` | exam_2023_p1.pdf | 1–40 |
| `exam_asli_batch_04` | `set_asli_04` | exam_2024_p1.pdf, exam_2024_p2.pdf | 1–80 |
| `exam_asli_batch_05` | `set_asli_05` | exam_2025_p1.pdf, exam_2025_p2.pdf | 1–75 |

Note: Each distinct exam set resets question numbering at 1. Only split-batch continuations maintain continuity (see section above).

### Processing Order

Process batches sequentially. Do not start batch N+1 until batch N has been:
1. Output as `exam_set.json`
2. Validated against `OUTPUT_VALIDATION_CHECKLIST.md`
3. Registered in `content_index.kimi.json`

---

## REGISTERING EXAM SETS IN content_index.kimi.json

After producing and validating each `exam_set.json`, register it in:
```
app_data/runtime/content_index.kimi.json
```

### examSets[] Entry Format

```json
{
  "id": "set_asli_02",
  "title": "Ujian Akhir Blok Neurologi 2022",
  "type": "asli",
  "questionCount": 90,
  "sourceFile": "app_data/domains/exam_asli/exam_sets/set_asli_02/exam_set.json",
  "source_label": "Univ Neurologi — Ujian Akhir 2022",
  "status": "active",
  "year": "2022",
  "subject": "Neurologi Klinis",
  "batchId": "exam_asli_batch_02"
}
```

Required fields for each entry:
- `id` — must match `exam_id` in the exam_set.json
- `title` — human-readable title
- `type` — `"asli"` or `"ai_generated"`
- `questionCount` — must match `metadata.total_questions` in exam_set.json
- `sourceFile` — path relative to project root (no leading slash)
- `source_label` — brief origin label shown in app UI

Recommended additional fields:
- `status` — `"active"` (published), `"draft"` (in review), `"archived"` (retired)
- `year` — exam year as string
- `subject` — medical subject/block
- `batchId` — links back to the processing batch

### Updating Counters

After adding a new entry to `examSets[]`, update these top-level fields:
- `examSetCount` — total number of entries in `examSets[]`
- `examQuestionCount` — sum of all `questionCount` values across all exam sets
- `generatedAt` — update to today's date (YYYY-MM-DD)

See `CONTENT_INDEX_REGISTRY_GUIDE.md` for full registry update procedure.

---

## SOURCE FILE PATH CONVENTIONS

All `sourceFile` paths in `content_index.kimi.json` must:
- Be relative to the project root (i.e., relative to `/home/user/CORTEX-SHELL/`)
- Never start with `/` or `./`
- Use forward slashes only (no backslashes)
- Point to the actual JSON file, not the directory

Correct:
```
"sourceFile": "app_data/domains/exam_asli/exam_sets/set_asli_02/exam_set.json"
```

Incorrect:
```
"sourceFile": "/app_data/domains/exam_asli/exam_sets/set_asli_02/exam_set.json"
"sourceFile": "./app_data/domains/exam_asli/exam_sets/set_asli_02/exam_set.json"
"sourceFile": "app_data/domains/exam_asli/exam_sets/set_asli_02/"
```

---

## HANDLING DUPLICATE QUESTIONS ACROSS EXAM SETS

It is common for medical exam sets to repeat questions across years. Duplicates must be identified and managed.

### Definition of a Duplicate

Two questions are considered duplicates if:
- Their `stem` values are textually identical (exact match), OR
- Their `stem` values are more than 85% similar (near-duplicate — same scenario, slightly rephrased)

### Detection

During Phase 4 (Validation) in `PROMPT_SOAL_VISION_AGENT.md`, the agent checks for duplicates within a single batch. Cross-batch duplicate detection is performed during the compile/audit phase.

To detect cross-batch duplicates, compare `stem` values across all `exam_set.json` files in the domain directory.

### Handling Rules

1. **Do not remove duplicates from exam_set.json.** Each exam set preserves its full question list, including questions that also appear in other sets. This maintains fidelity to the source exam.
2. **Mark duplicates in the master question bank** (see section below) with a `source_exams[]` field listing all exam IDs where the question appears.
3. **Do not merge explanations** from different exam sets. Each exam set may have a different answer key or explanation; keep them separate.
4. **Log duplicates** in `metadata.notes[]` of the affected exam_set.json files:
   ```json
   "notes": ["Q15 matches Q22 in set_asli_01 — possible repeat question"]
   ```

---

## BUILDING A MASTER QUESTION BANK BY TOPIC

After all exam sets are processed and validated, a master question bank can be compiled. This is an aggregate view, not a replacement for individual exam_set.json files.

### Master Bank Structure

```json
{
  "bank_id": "master_bank_neuro_v1",
  "generated_date": "2026-06-10",
  "topic": "Neurologi Klinis",
  "total_questions": 347,
  "questions": [
    {
      "canonical_id": "mq_neuro_001",
      "stem": "...",
      "options": [...],
      "answer_index": 0,
      "explanation": "...",
      "confidence": "High-Yield",
      "topic_tags": [...],
      "difficulty": "sedang",
      "source_exams": ["set_asli_01", "set_asli_03"],
      "appearance_count": 2
    }
  ]
}
```

Key difference from exam_set.json:
- Questions are deduplicated — each unique question appears once
- `source_exams[]` lists every exam set where the question appeared
- `appearance_count` indicates how many times the question has appeared (useful for identifying high-yield questions)
- `canonical_id` is a new master-bank-level identifier (not replacing `number`)

### When to Build the Master Bank

Build the master bank after:
1. All exam sets for a domain are processed and validated
2. All files are registered in `content_index.kimi.json`
3. The compile/audit step in `COMPILE_AUDIT_GUIDE.md` is complete

The master bank file path:
```
app_data/domains/exam_asli/master_bank/master_bank_[subject]_v[N].json
```

Register the master bank in `content_index.kimi.json` under a separate `masterBanks[]` array (to be added when the first master bank is created).
