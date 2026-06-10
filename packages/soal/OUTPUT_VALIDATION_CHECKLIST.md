# OUTPUT VALIDATION CHECKLIST — exam_set.json QA
**Version:** 2.0  
**Package:** packages/soal  
**Run this checklist before finalizing every exam_set.json**

---

## HOW TO USE THIS CHECKLIST

Run every item on this checklist before saving the final `exam_set.json` file. Items marked **CRITICAL** must pass — a failure is a blocking issue that requires correction before the file can be published. Items marked **WARNING** should be investigated and resolved if possible, but do not block publication if a valid reason exists.

Record any failures or warnings in `metadata.validation_flags[]` in the exam_set.json file.

---

## SECTION 1 — JSON SYNTAX AND FILE STRUCTURE

### 1.1 CRITICAL — JSON is syntactically valid

The file must parse without errors. Before submitting, validate with:
```
JSON.parse(fileContent)   // no exception
```
Common failure causes:
- Trailing comma after last array item or last object property
- Unescaped double quotes inside string values (use `\"`)
- Unescaped newlines inside string values (use `\n`)
- Missing closing brace or bracket
- Non-UTF-8 characters from OCR (replace with correct Unicode or ASCII equivalent)

Pass condition: File parses successfully as valid JSON.

### 1.2 CRITICAL — All required top-level fields present

Verify the following fields exist and are non-empty:
- [ ] `exam_id` — string, non-empty
- [ ] `title` — string, non-empty
- [ ] `type` — exactly `"asli"` or `"ai_generated"`
- [ ] `subject` — string, non-empty
- [ ] `year` — string (4-digit year)
- [ ] `questions` — array, not empty
- [ ] `metadata` — object present

### 1.3 CRITICAL — metadata block complete

Verify all required metadata fields:
- [ ] `metadata.source_pdf` — array, at least one filename
- [ ] `metadata.batch_id` — string, matches batch naming convention
- [ ] `metadata.total_questions` — integer
- [ ] `metadata.processed_date` — ISO date string (YYYY-MM-DD)
- [ ] `metadata.agent_version` — string

---

## SECTION 2 — QUESTION COUNT AND NUMBERING

### 2.1 CRITICAL — Question count matches source PDF

Manually verify: count the numbered questions in each source PDF. The count must match:
- `questions[].length` in the JSON
- `metadata.total_questions` in the JSON
- `questionCount` that will be entered in `content_index.kimi.json`

Failure condition: Any discrepancy in these three values is a blocking error.

### 2.2 CRITICAL — total_questions matches questions array length

```
metadata.total_questions === questions.length
```

These must be identical. If they differ, either a question was missed or a duplicate was added.

### 2.3 CRITICAL — Question numbers are unique and sequential

Every `question.number` value must be:
- A positive integer
- Unique within the file (no two questions with the same number)
- Sequential starting at 1 (or at the continuation number for split-batch files)

Allowed exception: Split-batch continuation files start at the number immediately following the last question of the previous batch (e.g., starting at 76 if previous batch ended at 75).

### 2.4 WARNING — Check for missing question numbers

If questions are numbered 1–50 but question 23 is missing from the array, that indicates a skipped question. Investigate and either recover the missing question or document the gap in `metadata.notes[]`.

---

## SECTION 3 — OPTION INTEGRITY

### 3.1 CRITICAL — All questions have exactly 4 options (or 5 if flagged)

For each question:
- [ ] `options[]` array has length 4
- Exception: length 5 is allowed only if `metadata.has_five_options === true` (or `metadata.notes` contains `"has_five_options"`)

Failure condition: Any question with fewer than 4 options (unless the missing option is documented as OCR-unreadable with a placeholder string).

### 3.2 CRITICAL — No empty option strings

Every entry in `options[]` must be a non-empty string. Empty string `""` or null is not allowed. If an option was unreadable, use `"[Option X — OCR unreadable]"` as a placeholder string.

### 3.3 WARNING — Options are substantively distinct

Scan for options that are identical or near-identical in wording. This may indicate a copy-paste error during extraction. Flag for human review if found.

---

## SECTION 4 — ANSWER INTEGRITY

### 4.1 CRITICAL — answer_index is in valid range

For each question, `answer_index` must be:
- An integer: 0, 1, 2, or 3 (for 4-option questions)
- An integer: 0, 1, 2, 3, or 4 (for 5-option questions)
- `null` only when `confidence` is `"Unverified"`

Any other value (negative number, integer >= 4 for standard questions, string, boolean) is a critical error.

### 4.2 CRITICAL — answer_index null requires Unverified confidence

If `answer_index` is `null`, then `confidence` must be `"Unverified"`. If `confidence` is not `"Unverified"` but `answer_index` is `null`, this is a contradiction — investigate and resolve.

### 4.3 WARNING — Count null answer_index values

Count how many questions have `answer_index: null`. If more than 20% of questions are unverified, log a note. A high proportion of unverified answers may indicate that the answer key PDF was not included in the batch.

Report the count in `metadata.notes[]`:
```json
"notes": ["8 of 60 questions (13%) have unverified answers — answer key not found in batch"]
```

---

## SECTION 5 — EXPLANATION QUALITY

### 5.1 CRITICAL — No empty explanations

Every `explanation` field must be a non-empty string. `null`, `""`, or `"N/A"` are not valid values.

If no explanation was available in the source material, construct one from medical knowledge and mark `answer_evidence` with `"Explanation reconstructed"`.

### 5.2 CRITICAL — Explanations meet minimum length

Every `explanation` must be at minimum 20 words. Explanations shorter than 20 words are considered inadequate and must be expanded.

Count words in the explanation string before finalizing.

### 5.3 WARNING — Explanation-answer consistency check

For each question, verify that the explanation logically supports the correct option (the one at `answer_index`).

Red flags:
- Explanation mentions a different option letter than `answer_index` points to
- Explanation describes a mechanism inconsistent with the answer
- Explanation is generic and could apply to any answer option

If an inconsistency is found, flag in `metadata.validation_flags[]` and investigate. The correct answer in the answer key takes precedence over the explanation; if in doubt, adjust the explanation to match the answer key and note the discrepancy.

### 5.4 WARNING — No generic filler explanations

Reject explanations that are clearly generic or copied without modification, such as:
- "This is the correct answer because it is the best option."
- "See textbook for details."
- Placeholder text left over from templates

---

## SECTION 6 — DUPLICATE DETECTION

### 6.1 WARNING — No duplicate question stems within file

Compare every `stem` value against all other `stem` values in the same file. If two questions have identical stems, this is likely an extraction error (the same question was extracted twice).

If found: Remove the duplicate and adjust `total_questions` accordingly. Note the duplicate in `metadata.notes[]`.

### 6.2 WARNING — Near-duplicate detection (>85% text overlap)

Use fuzzy text comparison on stems. Questions with more than 85% textual overlap may be paraphrases of the same question. Flag for human review.

Do not automatically remove near-duplicates without human confirmation — they may be intentionally similar questions testing the same concept with slightly different clinical presentations.

---

## SECTION 7 — CONFIDENCE CATEGORIES

### 7.1 CRITICAL — confidence values are from allowed vocabulary

For `type: "asli"`, each `confidence` value must be one of:
- `"High-Yield"`
- `"Kunci"`
- `"Clinical Reasoning"`
- `"Patofisiologi"`
- `"Klinis"`
- `"Unverified"`
- `"Low — OCR artifact"`

For `type: "ai_generated"`, the `confidence` value is a free-text topic label and must be:
- A non-empty string
- Descriptive of the question's specific subtopic
- Not a generic label like "question" or "topic"

### 7.2 WARNING — confidence distribution check

For exam_asli, check that the distribution of confidence values is reasonable. An exam with all questions labeled `"Kunci"` or all labeled `"High-Yield"` may indicate incorrect blanket assignment.

Expected rough distribution for a well-balanced exam:
- At least some `"Clinical Reasoning"` questions (clinical vignette exams typically have 30–50%)
- A mix of `"High-Yield"`, `"Kunci"`, and `"Patofisiologi"`
- Fewer than 20% `"Unverified"` (unless answer key was missing)

---

## SECTION 8 — ANSWER EVIDENCE

### 8.1 WARNING — answer_evidence is non-empty for all questions

Every `answer_evidence` field must be a non-empty string. It must indicate where the answer was sourced from.

Acceptable values include:
- `"Printed answer key, page 8"` — answer from official answer key
- `"Neurologi Klinis — Bab Afasia"` — answer from textbook reference
- `"Explanation reconstructed from medical knowledge"` — answer inferred
- `"Handwritten annotation, page 3"` — from student/lecturer marking on sheet

Unacceptable values:
- Empty string `""`
- `"N/A"`
- `"Unknown"`

### 8.2 WARNING — answer_evidence consistency

If `confidence` is `"Unverified"`, the `answer_evidence` should note why verification failed (e.g., "Answer key not found in batch PDFs").

---

## SECTION 9 — IMAGE REFERENCES

### 9.1 WARNING — image_ref and needs_visual_asset consistency

For every question:
- If `image_ref` is set (non-null), then `needs_visual_asset` must be `true`.
- If `needs_visual_asset` is `true`, then `image_ref` must be set (non-null, non-empty).

### 9.2 WARNING — image_ref naming convention

All `image_ref` values must follow the pattern:
```
image_[type]_q[number]_[batch_id_short]
```
Examples:
- `"image_ecg_q12_batch01"`
- `"image_xray_q34_batch02"`
- `"image_ct_q07_batch01"`

### 9.3 CRITICAL — Image-based questions have image description in stem

If a question references a visual (ECG, X-ray, etc.) and `image_ref` is set, the `stem` must include a text description of the image in the format:
```
[IMAGE DESCRIPTION — type]: [description text]
```

A question that says only "Perhatikan gambaran EKG berikut" with no description in the stem is unusable for students who do not have the image asset. The text description is mandatory.

---

## SECTION 10 — REGISTRATION READINESS

### 10.1 CRITICAL — exam_id is unique in the registry

Before finalizing, check `content_index.kimi.json`. The `exam_id` of the new file must not already exist in the `examSets[]` array.

### 10.2 CRITICAL — sourceFile path is correct

Verify that the `sourceFile` path points to the actual location of the exam_set.json file on disk, relative to the project root.

### 10.3 CRITICAL — Directory exists

Verify that the directory at the `sourceFile` path exists before writing the file.

---

## VALIDATION SUMMARY TEMPLATE

Copy this summary into `metadata.validation_flags[]` upon completing the checklist:

```json
"validation_flags": [
  "VALIDATION PASS — [DATE]",
  "[List any warnings or failures here, one string per item]",
  "Questions with null answer_index: [N]",
  "Questions with image_ref: [N]",
  "OCR reconstruction applied: [Y/N — list question numbers if Y]"
]
```

If all sections pass with no failures or warnings:
```json
"validation_flags": ["VALIDATION PASS — [DATE] — No issues found"]
```
