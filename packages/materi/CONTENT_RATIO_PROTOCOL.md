# CONTENT_RATIO_PROTOCOL.md
# CORTEX-SHELL — 60% Source / 40% AI Research Content Protocol
# Version: 1.0 | Permanent Anchor File
# Purpose: Defines what counts as source content, what counts as AI-generated content,
#          where each belongs in the JSON schema, and how to maintain medical accuracy

---

## Overview

The CORTEX-SHELL content philosophy is that lecture slides provide the **foundation** (what the instructor intended to teach), while AI research adds the **depth** (what a comprehensive textbook would say about the same topic). Neither alone is sufficient. Together, they produce content that is both exam-relevant AND clinically rigorous.

**Target ratio**: 60% content derived from the provided PDF sources + 40% content from AI knowledge base.

This ratio is measured at the **section level** — not the individual paragraph or character level.

**Bahasa Indonesia:** Rasio konten CORTEX-SHELL adalah 60% dari PDF sumber + 40% dari pengetahuan AI. Rasio ini diukur pada level section, bukan per paragraf. Tujuannya: PDF memberikan fondasi (apa yang dosen ajarkan), AI menambahkan kedalaman (apa yang buku teks komprehensif katakan).

---

## PART 1 — DEFINITIONS

### 1.1 "Source Content" (60%)

Source content is ANYTHING extracted or directly paraphrased from the provided PDF files in the batch.

**Source content includes:**
- Text directly copied or paraphrased from lecture slides
- Data, statistics, and figures as printed in slides
- Lists, tables, and algorithms that appear in the PDFs
- Image content: clinical descriptions of embedded diagrams, radiographs, flowcharts
- Handwritten annotations by the instructor (marginalia, corrections, additions)
- Slide titles and section headings
- Speaker notes if embedded in the PDF
- Content from image-only PDFs (OCR-extracted text or vision-described visual content)

**Source content does NOT include:**
- Any information the agent knows from its training but that is not in the PDF
- Dosages or criteria that are "standard knowledge" but not written in the PDF
- Pathophysiology detail not present in the slides
- Mnemonics invented by the agent

**Practical test**: "Could I point to the specific slide page where this information came from?" If yes → source content. If no → AI content.

---

### 1.2 "AI Research Content" (40%)

AI research content is authoritative information added by the agent from its knowledge base to complement and deepen the source material.

**AI research content comes from:**

| Category | Examples |
|---|---|
| Standard medical textbooks | Harrison's Principles of Internal Medicine (20th+ edition), Robbins & Cotran Pathologic Basis of Disease, Kumar & Clark's Clinical Medicine, Guyton & Hall Medical Physiology, Gray's Anatomy, Tintinalli's Emergency Medicine |
| International clinical guidelines | WHO protocols, AHA/ACC guidelines, ESC guidelines, IDSA guidelines, Surviving Sepsis Campaign, UpToDate evidence summaries |
| Indonesian national guidelines | PERDOSSI (Neurology), PAPDI (Internal Medicine), IDI protocols, PNPK (National Clinical Practice Guidelines) |
| Landmark clinical trials | RCT results (e.g., DAWN, DEFUSE 3, SPRINT, ACCORD, ISIS-2) |
| Evidence-based mechanisms | Pathophysiology from established physiology/pharmacology textbooks |

**AI research content purpose:**
- Add pathophysiology mechanisms not described in slides
- Provide specific clinical guideline recommendations
- Add comparative statistics (NNT, NNH, relative risk, absolute risk)
- Contextualize the clinical relevance of what the slides describe
- Generate bilingual explanations (simple, intermediate, advanced tiers)
- Write glossary definitions with clinical depth
- Create exam pearls, mnemonics, and clinical pearls

---

## PART 2 — WHERE EACH TYPE OF CONTENT BELONGS

### 2.1 Content Placement Matrix

| Field / Location | Primarily Source | Primarily AI | Notes |
|---|---|---|---|
| `content[0]` (Paragraph 1) | ✓ Source | — | Core definition from source |
| `content[1]` (Paragraph 2) | — | ✓ AI | Mechanism/pathophysiology deepening |
| `content[2]` (Paragraph 3) | ✓ Source | — | Clinical features from source |
| `content[3]` (Paragraph 4) | Mixed | Mixed | Complications — both |
| `content[4]` (Paragraph 5) | — | ✓ AI | Evidence/guidelines |
| `bullets[].text` (main) | ✓ Source | — | Exam-relevant source facts |
| `bullets[].sub` | Mixed | Mixed | Detail sub-bullets can add AI data |
| `callouts[exam_pearl]` | — | ✓ AI | MCQ patterns and mnemonics |
| `callouts[clinical_pearl]` | — | ✓ AI | Bedside tips from practice |
| `callouts[warning]` | ✓ Source | Mixed | Source contraindications, AI confirms |
| `callouts[teaching_point]` | — | ✓ AI | Conceptual explanations |
| `summary[]` (module) | ✓ Source | — | Core teaching points from source |
| `exam_focus[]` | ✓ Source | Mixed | Source topics, AI phrasing |
| `glossary[].meaning` | Mixed | ✓ AI | AI adds depth to source definition |
| `bilingual.simple_id` | — | ✓ AI | AI writes lay explanations |
| `bilingual.bilingual_id` | Mixed | ✓ AI | Academic Indonesian translation |
| `bilingual.bilingual_en` | Mixed | ✓ AI | Academic English translation |
| `bilingual.medical_id` | ✓ Source | ✓ AI | Specialist level — both |
| `section.summary` | ✓ Source | — | Distilled from source content |

### 2.2 The 60/40 at Section Level

For a typical section with 3 content paragraphs, 4 bullets, and 4 callouts:

**Source-heavy elements (targeting ~60% of words):**
- content[0]: Paragraph 1 — core concept from source (~120 words)
- content[2]: Paragraph 3 — clinical presentation/management from source (~120 words)
- bullets[0–3]: Main bullet text from source facts (~160 words)
- section summary: Distilled from source (~60 words)
**Source subtotal: ~460 words / ~60%**

**AI-heavy elements (targeting ~40% of words):**
- content[1]: Paragraph 2 — pathophysiology deepening (~120 words)
- callouts[0–3]: All 4 callouts (~200 words)
- bilingual entry (~140 words)
**AI subtotal: ~460 words / ~40%** (coincidental)

This is a rough guide — do not count words mechanically. Use editorial judgment.

---

## PART 3 — WHAT MUST NOT BE AI-GENERATED

### 3.1 Absolute Prohibitions

Never fabricate or invent these elements:

| Prohibited | Reason |
|---|---|
| Specific case study patient identifiers or outcomes from source PDFs | These are the instructor's specific examples — do not alter |
| Exact statistics/percentages printed in source slides | Use source numbers exactly |
| Drug dosages that appear in source PDFs | If source says "0.9 mg/kg" — use exactly that |
| Specific exam question numbers or past exam data | Cannot be fabricated |
| Institutional-specific protocols not in source | May contradict actual practice |
| Clinical trial results that are uncertain or contested | Do not present uncertain evidence as settled |
| Local epidemiological data for Indonesia unless from reliable source | Use with source citation |

### 3.2 Dosage Rule

**Drug dosages follow a hierarchy:**

1. **Source PDF has the dosage** → Use exactly as written. Do not "correct" it unless it is clearly a typo (e.g., "0.9 g/kg" when context makes clear it means "0.9 mg/kg"). If correcting a typo, flag with `[CORRECTED: original said X, standard dose is Y]`.

2. **Source PDF does NOT have the dosage** but you are adding content about this drug → Use the standard guideline dosage AND mark with `[AI_RESEARCH: dose from standard guidelines]`.

3. **Source PDF dosage conflicts with standard guidelines** → Use source PDF dosage in the main content (this is what students will be tested on), AND add a `teaching_point` callout noting the guideline dosage for context.

### 3.3 Statistics Rule

Same hierarchy applies to statistics (percentages, NNT, relative risk, etc.):
1. Source figure → use exactly
2. No source figure → AI-generated with `[AI_RESEARCH]` tag
3. Conflicting figures → note both, prefer most recent/authoritative

---

## PART 4 — HOW TO MARK AI-GENERATED CONTENT

### 4.1 The ai_additions[] Field

Every section must include an `ai_additions[]` array that tracks all AI-generated content in that section. This field is an audit trail — it allows quality reviewers to identify and verify AI additions.

**Format:**
```json
"ai_additions": [
  {
    "location": "content[1]",
    "type": "pathophysiology_expansion",
    "source_basis": "Guyton & Hall Medical Physiology, Chapter 62 — Cerebrovascular Accident",
    "text_preview": "The ischemic cascade begins with ATP depletion..."
  },
  {
    "location": "callouts[2] (exam_pearl)",
    "type": "mnemonic",
    "source_basis": "Standard medical education — widely used mnemonic",
    "text_preview": "FAST mnemonic: Face drooping..."
  },
  {
    "location": "bilingual.simple_id",
    "type": "clinical_context",
    "source_basis": "AI-generated lay language explanation",
    "text_preview": "Ketika pembuluh darah tersumbat..."
  }
]
```

### 4.2 AI Addition Type Values

| Type | Description |
|---|---|
| `pathophysiology_expansion` | Added mechanism detail beyond source |
| `guideline_addition` | Specific clinical guideline content |
| `mechanism_detail` | Molecular/cellular detail not in source |
| `clinical_context` | Clinical application context |
| `mnemonic` | AI-created or AI-recalled mnemonic |
| `comparative_data` | Added NNT, relative risk, comparison stats |
| `evidence_basis` | Added RCT/meta-analysis evidence |
| `bilingual_content` | Bilingual tier content (all tiers are AI-generated) |
| `glossary_expansion` | Expanded glossary definition beyond source |
| `AI_only_section` | Entire section is AI-generated |
| `contradiction_resolved` | AI resolved conflicting PDF content |

### 4.3 When ai_additions[] is Empty

If a section contains ONLY source-extracted content (no AI additions at all), use an empty array:
```json
"ai_additions": []
```

This is rare — most sections will have at least bilingual content and callouts that are AI-generated.

---

## PART 5 — MEDICAL ACCURACY REQUIREMENTS

### 5.1 Accuracy Hierarchy

When accuracy is uncertain, follow this precedence:

```
1. Source PDF (instructor's intended content for this course)
     ↓
2. National guidelines for Indonesia (PERDOSSI, PAPDI, PNPK)
     ↓
3. International society guidelines (AHA, ESC, WHO, IDSA)
     ↓
4. Standard textbook (Harrison's, Robbins, Kumar & Clark)
     ↓
5. AI knowledge — with appropriate hedging language
```

### 5.2 Required Hedging Language for AI Content

When AI-generated content discusses specific clinical thresholds or recommendations that may vary by institution or update over time, use hedging language:

| Situation | Required phrasing |
|---|---|
| Guideline that may have been updated | "Per [guideline name] (last major revision [year])..." |
| Clinical threshold with some variation | "Most guidelines target [X]; some centers use [Y]..." |
| Evidence level varies | "Evidence level [A/B/C] per [guideline]..." |
| Emerging evidence | "Emerging evidence suggests... (not yet incorporated into major guidelines)" |
| Indonesian vs international practice | "International guidelines recommend [X]; Indonesian practice may vary by institution" |

### 5.3 Pharmacology Accuracy Checklist

Before including any drug information in a section:
- [ ] Drug name is spelled correctly (generic name primary, brand in parentheses)
- [ ] Dosage matches source PDF (or flagged as AI_RESEARCH if not in source)
- [ ] Route of administration is specified (IV, IM, PO, IN, SC, topical)
- [ ] Timing/frequency is specified
- [ ] Major contraindications are included if drug has life-threatening contraindications
- [ ] If drug is a controlled substance, note this where clinically relevant

### 5.4 Diagnostic Threshold Accuracy

For any diagnostic scoring system or threshold:
- [ ] Score range is correct (e.g., NIHSS 0–42, ASPECTS 0–10)
- [ ] Cutoff values match the validated version of the tool
- [ ] Clinical interpretation of scores is correct
- [ ] If newer versions of the tool exist, use current version

### 5.5 Epidemiological Data Caution

Epidemiological statistics (incidence, prevalence, mortality rates) can vary significantly:
- By geography (Indonesia vs. global vs. high-income countries)
- By time period (data from 2010 vs. 2023 may differ substantially)
- By methodology (registry-based vs. community-based vs. hospital-based)

When using epidemiological data:
- Prefer data from Indonesian sources for Indonesian epidemiology (if available)
- For global data, use WHO figures or major systematic reviews
- Tag with `[AI_RESEARCH]` and note the approximate source
- Do not present outdated figures as current without qualification

---

## PART 6 — ENRICHMENT QUALITY STANDARDS

### 6.1 What Makes Good AI Enrichment

The 40% AI-enriched content should pass this test:

**"Would a senior medical educator teaching this topic say this in a lecture?"**

Good AI enrichment:
- Explains the "why" behind clinical facts (mechanism)
- Provides memorable mnemonics or frameworks
- Connects this topic to other clinical topics (integrated thinking)
- Gives bedside-applicable clinical pearls
- Highlights what students commonly get wrong (exam traps)
- Provides the evidence basis for key recommendations

Bad AI enrichment:
- Generic statements that could apply to any topic ("This is important for medical students")
- Redundant content that merely restates what the source already said
- Overly complex information that goes far beyond the course level
- Unverified statistics stated with false precision
- Opinions presented as facts

### 6.2 AI Enrichment Depth by Section Type

| Section Type | Appropriate AI Enrichment Depth |
|---|---|
| Epidemiology | Add global comparisons, risk factor quantification, Indonesian-specific data |
| Pathophysiology | Add molecular mechanisms, cascade details, cellular biology |
| Clinical Presentation | Add syndromic comparisons, mimics, red flags, pattern recognition |
| Diagnosis/Imaging | Add sensitivity/specificity data, technical details, algorithm context |
| Management/Treatment | Add NNT/NNH data, comparative efficacy, guideline recommendations |
| Complications | Add pathophysiology of each complication, monitoring targets |
| Prognosis/Prevention | Add risk reduction data, timeline of benefit, patient counseling points |
| Case Studies | AI should NOT add to case clinical data — only add teaching analysis |

### 6.3 Do Not Over-Enrich

Signs of over-enrichment (too much AI content):
- Students cannot identify the core teaching point from the source material
- Content is more appropriate for a subspecialty textbook than a medical school course
- The AI additions have more clinical detail than the source slides
- Section reads like a review article rather than a study guide

If a section feels over-enriched: move the most advanced content to a `teaching_point` callout (which signals "advanced" material), and trim the main `content[]` paragraphs.

---

## PART 7 — BILINGUAL CONTENT AS AI-GENERATED CONTENT

### 7.1 All Bilingual Tiers Are AI-Generated

All three (or four) tiers of bilingual content (`simple_id`, `bilingual_id`, `bilingual_en`, `medical_id`) are considered AI-generated content, even when they closely paraphrase the source material. They should all appear in `ai_additions[]`:

```json
{
  "location": "section.bilingual",
  "type": "bilingual_content",
  "source_basis": "AI translation and tier-adaptation of source content",
  "text_preview": "simple_id + bilingual_id/en + medical_id..."
}
```

### 7.2 Bilingual Accuracy Standard

- `simple_id`: Must be comprehensible to an educated non-medical adult. Use everyday words. No Latin terms, no English abbreviations without Indonesian explanation.
- `bilingual_id`: Must use correct Indonesian medical terminology. Terminology should match standard Indonesian medical textbooks and KBBI (Kamus Besar Bahasa Indonesia) where available.
- `bilingual_en`: Must use correct English medical terminology. American English preferred (AHA, NIH standards).
- `medical_id`: Must be at specialist level — full pathophysiological mechanisms, pharmacological mechanisms, evidence basis. An Indonesian internist or specialist should recognize this as accurate.

---

## PART 8 — QUICK REFERENCE DECISION GUIDE

```
When writing a content paragraph, ask:
  "Is this directly from the PDF slides?"
    → YES: Mark as source content. Write it.
    → NO: Is this from standard medical knowledge (Harrison's, guidelines)?
      → YES: Write it. Tag in ai_additions.
      → NO: Do not include. It is speculation.

When adding statistics, ask:
  "Is this number in the PDF?"
    → YES: Use exactly as written.
    → NO: Is this from a major guideline or landmark trial?
      → YES: Include with [AI_RESEARCH] marker.
      → NO: Do not include a specific number. Use a range or omit.

When writing a callout, ask:
  "Is this a teaching point that would appear in a standard textbook?"
    → YES: Include.
    → "Is this something a senior clinician would routinely say?"
    → YES: Include.
    → If neither → do not include.

When writing bilingual content, ask:
  "Is this the same clinical information as the source, just at a different language level?"
    → YES: Include. Tag in ai_additions as bilingual_content.
    → "Am I adding NEW clinical claims not in the source?"
    → YES: Tag as AI-generated content with source basis.
```

---

*CORTEX-SHELL Content Ratio Protocol v1.0*
*Permanent anchor file — defines the editorial policy for all Materi domain content.*
