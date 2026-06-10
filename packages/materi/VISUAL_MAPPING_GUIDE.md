# VISUAL_MAPPING_GUIDE.md
# CORTEX-SHELL — Visual Asset Identification, Naming & Cataloging
# Version: 1.0 | Permanent Anchor File
# Purpose: Standard operating procedure for all visual assets found in source PDFs

---

## Overview

Every embedded image, diagram, chart, photograph, or figure found in a source PDF must be:
1. Assigned a unique `visual_id`
2. Described with a clinical alt text
3. Logged in the section's `visual_refs[]` array
4. Cataloged in the module's `visual_asset_manifest[]` array

No image should be silently discarded. Even low-quality or unidentifiable images must be logged.

**Bahasa Indonesia:** Setiap gambar, diagram, grafik, atau foto yang ditemukan dalam PDF sumber harus diberikan ID unik, dideskripsikan secara klinis, dan dicatat dalam `visual_refs[]` dan `visual_asset_manifest[]`. Tidak ada gambar yang boleh diabaikan.

---

## PART 1 — VISUAL ID NAMING CONVENTION

### Format

```
visual_[topic]_[descriptor]_[sequential_number]
```

All lowercase. Underscores only. No spaces, no hyphens.

### Components

| Component | Description | Rules |
|---|---|---|
| `visual` | Fixed prefix | Always "visual" |
| `[topic]` | Clinical topic slug | 1–3 words in snake_case from the module topic. Examples: `stroke`, `cardiac_arrest`, `aki`, `pneumonia`, `liver_cirrhosis` |
| `[descriptor]` | What the visual shows | 1–3 words describing the specific content. Examples: `CT_hemorrhage`, `pathophysiology_cascade`, `NIHSS_scale`, `drug_protocol`, `anatomy_coronary` |
| `[sequential_number]` | 2-digit zero-padded number | `01`, `02`, `03`... per module. Reset to `01` for each NEW module, NOT each section. |

### Examples

```
visual_stroke_CT_ischemia_01
visual_stroke_penumbra_core_diagram_02
visual_stroke_tPA_dosing_protocol_03
visual_stroke_NIHSS_assessment_tool_04
visual_stroke_thrombectomy_devices_05
visual_cardiac_ECG_STEMI_01
visual_aki_pathophysiology_diagram_01
visual_pneumonia_CXR_consolidation_01
visual_diabetes_insulin_protocol_01
visual_anatomy_coronary_arteries_01
```

### Cross-Batch Sequential Numbering

When a module spans multiple batches (see `BATCH_PROCESSING_GUIDE.md`):
- Continue the sequential number from where the previous batch ended
- Batch 1 might end at `visual_stroke_..._15`
- Batch 2 continues from `visual_stroke_..._16`
- The `visual_asset_manifest[]` in the final merged module.json will contain all entries with unique IDs

---

## PART 2 — ASSET TYPE CLASSIFICATION

### Asset Type Registry

Every visual asset must be classified as one of the following types:

| Asset Type | Description | Examples |
|---|---|---|
| `infographic` | Multi-element visual combining text, icons, and data | Overview summaries, "facts about X" cards, multi-step visual lists |
| `diagram` | 2D schematic illustration | Pathophysiology flow diagram, receptor mechanism, anatomical cross-section line drawing |
| `diagram_3d` | Three-dimensional rendered illustration | 3D anatomy renders, molecular structure diagrams, 3D organ models |
| `radiology` | Medical imaging: X-ray, CT, MRI, ultrasound, nuclear | CXR, CT brain, MRI spine, echo image, PET scan, bone scan |
| `chart` | Data visualization: bar, line, pie, scatter | Survival curves, epidemiological trends, dose-response charts |
| `flowchart` | Decision flow or process diagram | Triage algorithm, diagnostic pathway, clinical decision tree |
| `protocol` | Clinical protocol or checklist visual | ACLS protocol card, sepsis bundle checklist, surgical safety checklist |
| `timeline` | Temporal sequence visual | Disease progression timeline, therapeutic window timeline, history of treatment development |
| `anatomy` | Anatomical illustration (photo or drawing) | Gross anatomy photo, histological slide, anatomical diagram with labels |
| `reference_card` | Compact reference table or quick-reference visual | Drug dosage reference card, scoring system reference, normal values table |
| `comparison` | Side-by-side comparison visual | Normal vs. pathological, treatment vs. no treatment, drug A vs. drug B |
| `algorithm` | Step-by-step decision algorithm | Management algorithm, differential diagnosis algorithm, treatment escalation steps |
| `procedure` | Medical procedure illustration | Intubation technique, lumbar puncture steps, IV access procedure |
| `equipment` | Medical equipment or device photo/diagram | Ventilator settings, ECG machine, surgical instrument |
| `unknown` | Asset type cannot be determined | Blurry, too small, or unidentifiable images |

### Classification Decision Tree

```
Is this a medical imaging scan (X-ray, CT, MRI, US, nuclear)?
  → YES: radiology

Is this a photo of anatomy (gross, histological, or procedural)?
  → YES: anatomy (if labeled diagram) OR procedure (if showing a technique)

Does this show a decision pathway or "if this, then that" logic?
  → YES: algorithm (if complex multi-branch) OR flowchart (if linear/simple)

Does this show data as a graph?
  → YES: chart

Does this show a step-by-step protocol or checklist?
  → YES: protocol

Does this compare two or more items side by side?
  → YES: comparison

Does this show timing or sequence over time?
  → YES: timeline

Is this a compact reference card (e.g., scoring system, drug dosages)?
  → YES: reference_card

Is this a schematic 2D illustration of a mechanism or structure?
  → YES: diagram

Is this a 3D rendered illustration?
  → YES: diagram_3d

Is this a multi-element combined visual (not fitting above categories)?
  → YES: infographic

Cannot determine content due to image quality?
  → YES: unknown
```

---

## PART 3 — WRITING CLINICAL ALT TEXT

### Purpose

Alt text serves two functions:
1. **Accessibility**: Describes the image for learners who cannot see it (screen readers, low bandwidth)
2. **Clinical teaching**: Conveys the teaching point that the image was intended to demonstrate

### Alt Text Formula

```
[Image type] + [What is shown] + [Key clinical finding or teaching point] + [Clinical relevance/implication]
```

**Length**: 2–4 sentences. 50–120 words.

### Examples

**Good alt text (radiology):**
> "Axial CT scan of the brain without contrast showing a hyperdense lesion in the right putamen and internal capsule, consistent with acute hypertensive hemorrhage. The hyperdensity (Hounsfield units ~60–80) represents acute blood products. There is mild surrounding hypodensity indicating early edema. This image demonstrates the typical CT appearance of basal ganglia hemorrhage, which must be excluded before thrombolysis can be considered in a stroke patient."

**Good alt text (algorithm):**
> "Clinical decision algorithm for acute ischemic stroke management showing two parallel pathways: the IV thrombolysis pathway (for patients within 4.5 hours with no contraindications) and the mechanical thrombectomy pathway (for large vessel occlusion patients within 24 hours). Decision nodes include NIHSS scoring, CT imaging, LVO confirmation, and contraindication checklist. The algorithm concludes with post-treatment monitoring protocols for each pathway."

**Good alt text (anatomy):**
> "Illustration of the cerebral arterial circle (Circle of Willis) showing the internal carotid arteries, anterior cerebral arteries, middle cerebral arteries, posterior communicating arteries, and posterior cerebral arteries. Color-coded annotations indicate the territory supplied by each vessel. The figure highlights the clinical importance of collateral blood supply — why good collaterals can extend the therapeutic window in stroke."

**Good alt text (chart):**
> "Line graph showing the relationship between time to treatment and clinical outcome in acute ischemic stroke, with time from symptom onset (0–8 hours) on the x-axis and percentage of patients achieving good functional outcome (mRS 0–2) on the y-axis. The curve shows a steep decline in outcome with each hour of delay, with best outcomes when treatment is given within 90 minutes. This illustrates the 'time is brain' concept quantitatively."

**Acceptable alt text for low-quality images:**
> "Low-resolution image located on slide 14. Partial text visible suggests a comparison table, possibly comparing diagnostic criteria or treatment options. Content is unreadable due to image quality. Visual asset cataloged for future image replacement."

### What to AVOID in alt text

- "Image showing..." (redundant — it is an image)
- "A picture of..." (same)
- Generic statements: "This shows important information about stroke"
- Technical image metadata: "JPEG image 800x600 pixels"
- Fabricated content: Do not invent clinical findings that you cannot see

---

## PART 4 — PLACEHOLDER COLOR AND ICON ASSIGNMENTS

### Purpose

CORTEX-SHELL renders visual placeholders (before the actual image loads) using a background color and an icon. These must be specified in every `visual_asset_manifest` entry.

### Color Assignments by Asset Type

| Asset Type | Placeholder Color | Hex Code | Rationale |
|---|---|---|---|
| `radiology` | Deep Navy | `#1A1A2E` | Dark background mimics radiology lightbox |
| `anatomy` | Dark Blue | `#16213E` | Professional medical illustration tone |
| `diagram` | Oxford Blue | `#0F3460` | Clean schematic background |
| `diagram_3d` | Deep Purple | `#533483` | 3D visualization depth cue |
| `flowchart` | Dark Slate Blue | `#2B4162` | Process/flow diagram tone |
| `algorithm` | Navy Blue | `#12355B` | Decision tree clinical tone |
| `protocol` | Dark Forest Green | `#1B4332` | Clinical protocol/checklist tone |
| `chart` | Dark Blue | `#1D3557` | Data visualization background |
| `infographic` | Dark Slate | `#3D405B` | Multi-element neutral background |
| `comparison` | Dark Indigo | `#2D3561` | Side-by-side comparison tone |
| `timeline` | Dark Teal | `#264653` | Temporal sequence tone |
| `reference_card` | Charcoal | `#2C3E50` | Reference material neutral tone |
| `procedure` | Deep Maroon | `#4A1942` | Clinical procedure gravity |
| `equipment` | Dark Brown-Gray | `#3D2B3D` | Equipment/device neutral tone |
| `unknown` | Medium Gray | `#4A4A4A` | Placeholder for unidentified |

### Icon Name Assignments

Specify a Material Design or Ionicon icon name for the placeholder:

| Asset Type | Suggested Icon Name |
|---|---|
| `radiology` | `body-outline` or `scan-outline` |
| `anatomy` | `fitness-outline` or `body` |
| `diagram` | `git-branch-outline` or `analytics-outline` |
| `diagram_3d` | `cube-outline` |
| `flowchart` | `shuffle-outline` or `git-merge-outline` |
| `algorithm` | `list-outline` or `options-outline` |
| `protocol` | `clipboard-outline` or `checkbox-outline` |
| `chart` | `stats-chart-outline` or `bar-chart-outline` |
| `infographic` | `layers-outline` or `grid-outline` |
| `comparison` | `swap-horizontal-outline` or `contract-outline` |
| `timeline` | `time-outline` or `hourglass-outline` |
| `reference_card` | `document-text-outline` or `bookmarks-outline` |
| `procedure` | `medkit-outline` or `hand-right-outline` |
| `equipment` | `hardware-chip-outline` or `construct-outline` |
| `unknown` | `help-circle-outline` |

---

## PART 5 — VISUAL ASSET MANIFEST ENTRY TEMPLATE

This is the exact structure to produce for each visual asset in `visual_asset_manifest[]`:

```json
{
  "visual_id": "visual_[topic]_[descriptor]_[number]",
  "source_pdf": "exact_filename.pdf",
  "source_page": 14,
  "asset_type": "radiology",
  "title": "CT Brain: Acute Ischemic Stroke — Early Signs",
  "alt_text": "Axial CT of the brain without contrast showing subtle hypodensity in the left MCA territory with loss of gray-white matter differentiation in the insular cortex ('insular ribbon sign'). The early CT changes indicate acute ischemia within 3–6 hours of onset. This image demonstrates the ASPECTS scoring regions and how early ischemic changes appear before frank infarction is visible.",
  "subtitle": "Early CT changes in acute MCA stroke — insular ribbon sign",
  "tags": ["CT", "brain", "ischemia", "MCA", "ASPECTS", "early_signs", "neuro"],
  "placeholderColor": "#1A1A2E",
  "placeholderIcon": "scan-outline",
  "section_id": "s05",
  "ai_generated": false
}
```

### Field Rules

| Field | Type | Required | Rules |
|---|---|---|---|
| `visual_id` | string | Yes | Unique per module. Follow naming convention exactly. |
| `source_pdf` | string | Yes | Exact filename with extension. |
| `source_page` | integer | Yes | 1-indexed page number in the source PDF. |
| `asset_type` | string | Yes | Must be one of the 15 registered types. |
| `title` | string | Yes | 4–10 words. English. Descriptive and specific. Format: "[Content]: [Specific Detail]" |
| `alt_text` | string | Yes | 2–4 sentences. Clinical description. 50–120 words. |
| `subtitle` | string | Yes | 1 sentence. Key teaching point or clinical relevance statement. |
| `tags` | array | Yes | 3–8 lowercase string tags. Clinical keywords, imaging modalities, anatomy, topic. |
| `placeholderColor` | string | Yes | Hex code from the color assignment table above. |
| `placeholderIcon` | string | Yes | Icon name from assignments above. |
| `section_id` | string | Yes | Which section this image belongs to (e.g., `"s05"`). |
| `ai_generated` | boolean | Yes | `false` for images from source PDFs. `true` only for AI-created placeholder descriptions. |

---

## PART 6 — HANDLING SPECIAL VISUAL CASES

### 6.1 Tables Found in PDFs

Tables are NOT classified as visual assets unless they appear as an embedded image (i.e., a screenshot of a table). If a table is extractable text:
- Extract as structured data in `content[]` paragraphs
- Represent as bullets in `bullets[]` if it's a comparison
- Do NOT create a `visual_asset_manifest` entry for text-based tables

If a table IS an image (embedded JPG/PNG table):
- Asset type: `reference_card` (if it's a reference table) or `comparison` (if comparing items)
- Create a manifest entry and extract all table data in the `alt_text`

### 6.2 Multi-Panel Images (Figure with A, B, C panels)

If a single image contains multiple panels (e.g., "Figure 3A-D"):
- Create ONE `visual_asset_manifest` entry with a single `visual_id`
- Describe ALL panels in the `alt_text`: "Multi-panel figure showing: Panel A — [description], Panel B — [description], Panel C — [description]"
- `tags` should include all topics covered across all panels

### 6.3 Logos, Decorative Elements, University Seals

- **Do NOT catalog**: Institutional logos, decorative borders, copyright watermarks, university seals
- These are not clinical content and should be ignored during visual extraction

### 6.4 Screenshots of Other Applications/Interfaces

If a PDF contains a screenshot of another application (e.g., a screenshot of an imaging software, a drug database, or an electronic medical record):
- Asset type: `reference_card` or `equipment` depending on what it shows
- Note in `alt_text`: "Screenshot of [application name/type] showing [what is displayed]"
- Extract any readable text from the screenshot

### 6.5 Handwritten Diagrams or Sketches

If an instructor has drawn a handwritten diagram or sketch (not printed):
- Classify as `diagram`
- Note in `alt_text`: "Hand-drawn diagram by instructor showing [description]"
- Tag with `"handwritten"` and `"instructor_addition"`
- Treat as high-priority source content (instructors sketch to clarify exam-relevant concepts)

### 6.6 Images That Are Too Small to Identify

Minimum size threshold: If an image is less than approximately 100x100 pixels equivalent in the PDF, it may be a decorative bullet or icon rather than clinical content.

For genuinely unidentifiable images:
- Asset type: `unknown`
- `placeholderColor`: `#4A4A4A`
- `alt_text`: Describe what CAN be seen: dimensions, rough shape, any visible text fragments
- `tags`: `["low_quality", "needs_replacement"]`
- Do NOT fabricate clinical content

---

## PART 7 — VISUAL EXTRACTION REGISTRY (Working Document)

During PDF processing, maintain an internal Visual Extraction Registry before writing the final manifest. Use this format as a working checklist:

```
VISUAL EXTRACTION REGISTRY
Module: [module_id]
Batch: [batch_id]
========================================

[1] visual_id: visual_stroke_CT_hemorrhage_01
    PDF: Stroke_Lecture_Part1.pdf | Page: 8
    Type: radiology
    Section: s05
    Quality: HIGH | MEDIUM | LOW | UNREADABLE
    OCR of embedded text labels: [any text labels visible on the image]
    Clinical description draft: [your working description]
    Teaching point: [one sentence]
    Tags draft: [comma-separated tags]

[2] visual_id: visual_stroke_NIHSS_scale_reference_01
    PDF: Stroke_Lecture_Part1.pdf | Page: 12
    Type: reference_card
    Section: s03
    Quality: HIGH
    [...]
```

This registry is internal working memory — it does NOT appear in the final module.json output. It is used to ensure no image is missed before assembly.

---

## PART 8 — QUALITY CHECKLIST FOR VISUAL MAPPING

Before submitting final module.json, verify:

- [ ] Every image on every PDF page has a `visual_id` assigned
- [ ] Every `visual_id` in `visual_refs[]` arrays has a matching entry in `visual_asset_manifest[]`
- [ ] Every `visual_asset_manifest` entry has a non-empty `alt_text` (minimum 50 characters)
- [ ] No duplicate `visual_id` values across the entire manifest
- [ ] Sequential numbers are correct (no gaps, no duplicates)
- [ ] Asset types are from the approved list only
- [ ] `section_id` references in manifest match actual section IDs in `sections[]`
- [ ] Low-quality images are logged (not silently dropped) with `"unknown"` type
- [ ] `ai_generated: false` for all source-PDF images; `ai_generated: true` for any AI-generated visual descriptions

---

*CORTEX-SHELL Visual Mapping Guide v1.0*
*Permanent anchor file — update only when visual system schema changes.*
