# OCR + VISION PROCESSING PROTOCOL — MATERI DOMAIN
## Maximum Extraction Guide for Lecture PDF Resources

**Version**: 1.0  
**Applies to**: All lecture PDF files sent to the Materi content agent  
**Priority**: MANDATORY — Every page must be processed before generating output  

---

## CRITICAL: Never Assume Text Extraction Is Sufficient

Many lecture PDFs in this project fall into one of three categories:

| Category | Description | Required Approach |
|----------|-------------|-------------------|
| **Type A** | PDF with extractable text (standard slides) | OCR text + Vision for images |
| **Type B** | Mixed PDF (some text layers, some image-only pages) | OCR text where available + full Vision for image pages |
| **Type C** | Fully scanned/image PDF (zero extractable text) | **FULL VISION ONLY** — treat every page as an image |

**Rule**: Assume Type C for all PDFs unless explicitly confirmed otherwise. Use Vision analysis first, then supplement with extracted text if available.

---

## Phase 1: PDF Ingestion & Classification

### Step 1.1 — Classify each PDF before extraction

For each PDF file provided:
1. Attempt text extraction (even minimal)
2. If extracted text yields < 20 characters per page average → **Flag as Type C (Pure Image)**
3. If extracted text yields 20–200 characters per page → **Flag as Type B (Mixed)**
4. If extracted text yields > 200 characters per page consistently → **Flag as Type A (Text-rich)**

### Step 1.2 — Page inventory

For each PDF, record:
- Total page count
- Estimated content density per page (low / medium / high)
- Presence of embedded figures, tables, photos
- Presence of handwritten annotations (margin notes, corrections, underlines, circles)

---

## Phase 2: Vision Analysis — Per-Page Protocol

### For EVERY page in EVERY PDF (no exceptions):

#### 2.1 — Slide Title & Heading Extraction
- Extract the primary heading/title from the slide
- Note subtitle or kicker text
- Record the slide number or sequence indicator if visible

#### 2.2 — Body Text Extraction
- For Type A/B: use extracted text layer as primary, Vision as verification
- For Type C: manually transcribe all visible text using Vision
- Handle: bullet points, numbered lists, tables, two-column layouts
- Preserve the original logical structure (not visual layout)

#### 2.3 — Embedded Image Analysis (CRITICAL)
For every image/diagram/figure/photo found on the page:

```
MANDATORY DESCRIPTION FORMAT:
1. What type of image is this? (diagram, chart, photo, radiograph, flowchart, microscopy, table, etc.)
2. What is the primary subject depicted?
3. What clinical/scientific information does it convey?
4. Are there labels, arrows, or annotations on the image?
5. What is the educational purpose of this image in the lecture context?
6. Generate a visual_ref ID for this image: visual_[topic]_[descriptor]_[N]
```

**Examples of required image descriptions**:
- Radiograph: "CT scan showing hyperdense MCA sign in the right M1 segment, indicative of acute thrombus"
- Diagram: "Schematic of the ischemic cascade showing ATP depletion → Na/K pump failure → glutamate release → calcium influx → cell death"
- Microscopy: "H&E staining at 40x showing liquefactive necrosis in ischemic brain tissue with macrophage infiltration"
- Graph: "Bar graph showing 30-day mortality rates: tPA group 12.4% vs control 18.7%, p<0.05"
- Table: "NIHSS scoring table listing all 11 items with 0-4 scale, extracted verbatim"

#### 2.4 — Handwritten Annotations
For any handwritten content (notes, corrections, underlines, circled text, margin annotations):

```
MANDATORY PROCESSING:
1. Transcribe the handwritten text exactly as written (even if abbreviations or shorthand)
2. Interpret the intention: Is it a correction? An addition? An emphasis mark?
3. Integrate into the relevant content block with a note: [ANNOTATION: ...]
4. If the annotation contradicts printed text → flag as: [CORRECTION: original → annotated]
5. If the annotation adds information not in printed text → add as additional bullet or callout
```

**Do not skip handwritten content.** Instructor annotations are often the most high-yield content.

#### 2.5 — Tables & Structured Data
For tables in lecture slides:
- Extract all cells (row × column)
- Convert to structured prose or bulleted list format
- Preserve comparison relationships (e.g., drug A vs drug B)
- Flag tables with ≥ 3 columns as requiring a visual reference entry (type: `reference_card`)

#### 2.6 — Mathematical Equations & Formulas
- Transcribe equations using plain text notation
- Example: `GFR = (Ucr × V) / Pcr` not rendered LaTeX
- Context: explain what the formula calculates and clinical use

---

## Phase 3: Difficult Content Handling

### 3.1 — Blurry or Low-Resolution Images
If an image is too blurry to describe accurately:
```
[VISUAL_UNCLEAR: Slide X, image N — image resolution insufficient for detailed description. 
 Estimated content: [best guess]. 
 Requires: human review or high-resolution replacement.]
```

### 3.2 — Partially Visible Text (Cropped/Obscured)
If text is cut off or obscured:
```
[TEXT_PARTIAL: "...remaining text visible: 'the pathophysiology of stroke involves...'"]
```
- Use surrounding context to infer missing content
- Mark inferred content with: `[INFERRED: ...]`

### 3.3 — Overlapping or Layered Slides
Some PDFs have builds/animations exported as multiple versions of the same slide:
- Identify slide sets that are sequential builds (partial → complete content)
- Use the FINAL (most complete) slide version
- Note: `[BUILD_SLIDE: Using final build from slides X-Y]`

### 3.4 — External References & Citations
When a slide references an external source (journal, textbook, guideline):
- Extract the citation fully if visible
- Use it to populate `answer_evidence` in callouts and bullets
- Do NOT silently drop citations — they are evidence markers

### 3.5 — Case-Based Slides
When a slide presents a clinical case (patient vignette):
- Extract as a full clinical scenario block
- Map to module section type: `"kind": "Case"`
- The case presentation becomes a `content[]` entry
- Clinical questions in the case become `bullets[]` or `callouts[]` with tone `teaching_point`

---

## Phase 4: Cross-PDF Synthesis

After processing ALL PDFs in the batch:

### 4.1 — Content Deduplication
- Identify slides that repeat the same concept across multiple PDFs
- Keep the most complete version; summarize others as supporting evidence
- Do NOT create duplicate section content

### 4.2 — Section Organization
- Group related slides from different PDFs into logical sections
- Section sequence: Introduction → Mechanism → Clinical → Diagnosis → Treatment → Complications → Prognosis
- Each PDF likely contributes to multiple sections — cross-pollinate accordingly

### 4.3 — Visual Asset Consolidation
- All images identified across all PDFs contribute to `visual_refs[]` and visual_asset_manifest entries
- Assign unique IDs: `visual_[module_short]_[descriptor]_[sequential_number]`
- No two entries should have the same ID

---

## Phase 5: Output Integration

After Vision analysis, map extracted content to module.json schema:

| Extracted Content | → | module.json Location |
|-------------------|---|----------------------|
| Slide title + body text | → | `sections[].content[].text` |
| Bullet points from slides | → | `sections[].bullets[]` |
| "Remember:", "Important:", "Pearl:" notes | → | `sections[].callouts[]` with tone `pearl` |
| Warning boxes, red-colored text | → | `sections[].callouts[]` with tone `danger` |
| Evidence-based statements with citations | → | `sections[].callouts[]` with tone `evidence` |
| Handwritten corrections | → | Integrated into relevant `content[]` or `bullets[]` |
| Images / diagrams / photos | → | `sections[].visual_refs[]` + new visual_asset_manifest entry |
| Technical terms, bolded terms | → | `sections[].glossary_refs[]` (term IDs) + `module.glossary[]` |
| Summary slides ("take-home messages") | → | `module.summary[]` |
| Exam-relevant slides ("exam tip", "high-yield") | → | `module.exam_focus[]` |
| Bilingual/simplified explanations | → | `sections[].bilingual` or `module.bilingual[]` |

---

## Quality Thresholds

| Metric | Minimum Standard |
|--------|-----------------|
| Pages processed | 100% — zero pages skipped |
| Embedded images described | 100% of identifiable images |
| Handwritten annotations | 100% transcribed |
| Tables extracted | 100% converted to text |
| Blurry/unclear content | Must be flagged (not silently dropped) |
| Minimum content per section | ≥ 2 content paragraphs + ≥ 3 bullets |
| Source attribution | ≥ 60% of callouts should have `answer_evidence` |

---

## Common Failure Modes to Avoid

| Failure | Description | Prevention |
|---------|-------------|------------|
| **Silent skip** | Skipping image-only pages | Use Vision on every page regardless of text availability |
| **Surface read** | Extracting only the first bullet from a densely packed slide | Scroll through entire slide content, extract ALL items |
| **Generic description** | "Image of brain" instead of detailed clinical description | Follow the 6-question image description format in §2.3 |
| **Annotation blindness** | Ignoring handwritten notes as noise | Treat handwritten content as primary source material |
| **Duplicate creation** | Creating the same section from two overlapping PDFs | Check for content overlap in §4.1 before structuring |
| **Citation loss** | Dropping `[Reference: X]` markers | Always preserve citations in `answer_evidence` |

---

## Reference: Vision Analysis Prompt Templates

Use these templates when calling Vision on an image:

### For Medical Diagrams:
```
Analyze this medical/scientific diagram thoroughly. Describe:
1. The main concept illustrated (pathophysiology / mechanism / anatomy / procedure)
2. All labeled structures, components, or steps visible
3. Directional flows or sequences (arrows, numbered steps)
4. Key clinical implication of the diagram
5. Generate a descriptive alt text suitable for a medical education platform
```

### For Radiological Images:
```
Analyze this medical image (X-ray/CT/MRI/Ultrasound). Describe:
1. Modality and body region
2. Normal landmarks visible
3. Abnormalities or pathological findings
4. Clinical significance of findings
5. How this image would appear in a textbook teaching example
Generate a descriptive alt text for educational use.
```

### For Handwritten Annotations:
```
Transcribe ALL handwritten text visible in this image.
Indicate: location on page, whether it appears to be a correction, addition, or emphasis.
If the text is ambiguous, provide the most likely interpretation in [brackets].
```

### For Tables:
```
Extract this table completely.
Provide: column headers, all rows with their values.
Then summarize: what is being compared, and what is the key clinical takeaway?
```

---

*This protocol is a permanent reference document. Update when new PDF categories are encountered.*  
*Last updated: 2026-06-10*
