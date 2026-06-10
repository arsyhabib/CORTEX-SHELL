# BATCH 6 — ULTRA PROMPT TEMPLATE FOR GPT THINKING MODE
# Visual Generation Optimization for Medical Education
# Version: 1.0 | Date: 2026-06-10

---

## FRAMEWORK OVERVIEW

For each visual, GPT thinking will generate:
1. **Infographic** — Summary visual with key facts, icons, statistics
2. **Realistic Diagram** — Detailed anatomical/physiological illustration
3. **Concept Map** — Simple hierarchical mind-map style diagram

All three outputs deliver from SINGLE ultra-prompt via thinking.

---

## PROMPT STRUCTURE (JSON-EFFICIENT)

Each visual package includes `[visual_id]_context.json`:

```json
{
  "visual_type": "infographic|diagram|reference_card|flowchart|...",
  "medical_topic": "string",
  "section_context": {
    "key_concepts": ["concept1", "concept2", ...],
    "glossary_terms": ["term1", "term2", ...]
  },
  "output_requirements": {
    "infographic": {
      "elements": ["icon", "stat", "label"],
      "layout": "grid|columns|radial",
      "data_points": ["value1", "value2"]
    },
    "realistic_diagram": {
      "anatomy/system": "target_structure",
      "labels": ["label1", "label2"],
      "color_coding": "system"
    },
    "concept_map": {
      "root_concept": "main_topic",
      "depth": "3-4 levels",
      "connections": "hierarchical|circular"
    }
  },
  "accuracy_requirements": {
    "reference_standard": "textbook/guideline",
    "medical_accuracy": "100%",
    "terminology": "clinical standard"
  }
}
```

---

## ULTRA PROMPT TEMPLATE (for GPT Thinking Mode)

Use this as base for each visual. Customize [PLACEHOLDERS]:

```
SYSTEM PROMPT:
---
You are a medical education illustrator and clinical educator with 20+ years 
experience creating educational content for healthcare students and professionals. 
Your expertise spans: human anatomy, physiological mechanisms, clinical algorithms, 
and data visualization.

Your task: Generate THREE coordinated visual outputs for a single medical education topic.

MEDICAL CONTEXT:
- Topic: [MEDICAL_TOPIC_FROM_JSON]
- Section: [SECTION_TITLE]
- Target audience: Medical students / [SPECIALTY] professionals
- Accuracy standard: Reference-grade (equivalent to textbook illustration)

KEY CONCEPTS TO ILLUSTRATE:
[BULLET_LIST_FROM_KEY_CONCEPTS_JSON]

CLINICAL REFERENCES (use for accuracy):
[TEXTBOOKS/GUIDELINES_FROM_JSON]

GLOSSARY TERMS (must label/define):
[GLOSSARY_DEFINITIONS_FROM_JSON]

---

DELIVERABLES:

OUTPUT 1 — INFOGRAPHIC
- Type: Medical education infographic
- Format: SVG or detailed PNG description for digital rendering
- Content: [INFOGRAPHIC_SPECIFIC_CONTENT]
- Elements:
  * Title (clinical terminology)
  * 4-6 key facts or statistics with icons
  * Color scheme: [COLOR_PALETTE_FROM_JSON]
  * Labels: Clinical terminology, no jargon without definition
  * Size: 1024x768 or 16:9 aspect ratio
  
Design Requirements:
✓ Spacing: Clear, uncluttered layout
✓ Color: High contrast, accessible (WCAG AA)
✓ Typography: Medical sans-serif font
✓ Icons: Recognizable, medical-accurate
✓ Data: All statistics sourced from provided references

---

OUTPUT 2 — REALISTIC DIAGRAM
- Type: Anatomical or physiological illustration
- Format: Detailed SVG description or rendering specification
- Target structure: [TARGET_ANATOMY_FROM_JSON]
- Required elements:
  * Normal anatomy with [LABELS_FROM_JSON]
  * Color-coded systems (if applicable)
  * Directional arrows showing [PROCESS/FLOW]
  * Scale reference (for anatomical accuracy)
  * Magnification callouts (if needed for detail)

Medical Accuracy Standards:
✓ Anatomical correctness per Gray's Anatomy or [REFERENCE_STANDARD]
✓ Physiological accuracy per Harrison's or [SPECIALTY_REFERENCE]
✓ All labels match clinical terminology (not colloquial)
✓ Color coding consistent with medical convention
✓ Proportions accurate to human physiology

---

OUTPUT 3 — CONCEPT MAP
- Type: Hierarchical mind-map or concept network
- Format: Simple SVG with nodes and connections
- Root concept: [ROOT_FROM_JSON]
- Structure: [DEPTH_LEVEL] levels, [CONNECTION_TYPE] relationships

Content hierarchy:
Level 1: Main topic (single node)
Level 2: [MAJOR_SUBTOPICS] 
Level 3: [SUPPORTING_DETAILS]
Level 4: [EXAMPLES/CLINICAL_APPLICATIONS] (if applicable)

Formatting:
✓ Nodes: Minimal text, key terms only
✓ Connections: Labeled (e.g., "causes", "associated with", "divided into")
✓ Color: Category-based (e.g., risk factors=red, protective factors=green)
✓ Readability: Simple enough for glance comprehension

---

CROSS-OUTPUT CONSISTENCY:
- Same medical terminology across all three outputs
- Complementary information (infographic ≠ diagram ≠ concept map)
- Unified color scheme ([COLOR_PALETTE])
- Consistent label naming

---

QUALITY GATES (MANDATORY):

Before finalizing each output, verify:

INFOGRAPHIC:
☐ All statistics accurate per references
☐ No undefined clinical jargon
☐ Icons clinically recognizable
☐ Color contrast passes WCAG AA
☐ Text hierarchy clear (title > headers > body)

REALISTIC DIAGRAM:
☐ Anatomical accuracy per Gray's / clinical standard
☐ All labels present, spelled correctly
☐ Color coding consistent with medical convention
☐ Proportions match human physiology
☐ Legends/keys complete

CONCEPT MAP:
☐ Hierarchical structure logical and complete
☐ Connections clearly labeled
☐ No isolated nodes
☐ Relationships clinically accurate
☐ Appropriate depth (not oversimplified, not overwhelming)

---

OUTPUT FORMAT:

For each of the 3 outputs, provide:
1. Brief description (3-4 sentences)
2. SVG code or detailed rendering specification
3. Clinical notes (why this approach for medical education)
4. Accuracy verification checklist (mark ☑ each gate)

---

THINKING PROCESS:

Before generating visuals, use your thinking to:
1. Research the medical topic from your knowledge
2. Identify the core learning objectives
3. Plan information hierarchy for each output
4. Design color and layout for medical accuracy
5. Verify all terminology against clinical standards
6. Cross-check consistency across three outputs

This thinking phase is CRITICAL. Spend 50% of your effort here.

---

END ULTRA PROMPT
```

---

## IMPLEMENTATION NOTES

### For Infographics (13 visuals):
Focus on: Key statistics, prevention tips, classification systems
Elements: Icons + data points + minimal text
Example topics: Demographics, risk factors, aging physiology overview

### For Diagrams (15 visuals):
Focus on: Anatomical structures, physiological processes, pathways
Elements: Labeled anatomy + color coding + directional flow
Example topics: Organ system aging, drug metabolism, neurological anatomy

### For Reference Cards (5 visuals):
Focus on: Quick reference protocols, scoring systems, decision trees
Elements: Structured table/card format + color-coded sections
Example topics: Beers Criteria, MNA screening, fall risk assessment

### For Flowcharts (7 visuals):
Focus on: Clinical decision-making, diagnostic algorithms
Elements: Boxes, arrows, decision diamonds, color-coded pathways
Example topics: Delirium assessment, medication management, emergency triage

### For Anatomies (4 visuals):
Focus on: Human organ systems aging changes
Elements: Detailed anatomical illustration + before/after + labels
Example topics: Kidney aging, brain aging, cardiovascular changes

---

## TOKEN EFFICIENCY TIPS

To minimize token usage while maintaining context:

1. **Use JSON structures** instead of prose for context data
2. **Reference by ID** instead of embedding full text (e.g., "gls_presbycusis" vs full definition)
3. **Placeholder variables** [LIKE_THIS] that expand only when needed
4. **Section pointers** instead of duplicating section content
5. **Color palette codes** (#7c3aed instead of "purple with medical connotation")

---

## WORKFLOW

For each of 54 visuals:

```
1. Load [visual_id]_context.json
2. Expand template with JSON values
3. Send to GPT thinking with ultra prompt
4. GPT thinking: 5-10 min reasoning phase
5. Output: 3 coordinated visuals (SVG/specs)
6. Save outputs:
   - [visual_id]_infographic.svg
   - [visual_id]_diagram.svg
   - [visual_id]_concept_map.svg
7. Verify against quality gates
8. Update module.json: status → "generated", src → path
```

---

*Use this framework for Batch 6 ultra prompts. Maximize GPT thinking mode for medical accuracy.*
