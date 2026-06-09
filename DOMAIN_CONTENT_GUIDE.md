# 📚 CORTEX 3-DOMAIN CONTENT CREATION GUIDE

## Quick Start

### 1️⃣ Adding a Module to MATERI Domain

```bash
# Create module folder
mkdir app_data/domains/materi/modules/module_001

# Copy template
cp app_data/templates/module_template.json \
   app_data/domains/materi/modules/module_001/metadata.json

# Edit metadata.json with your module details
nano app_data/domains/materi/modules/module_001/metadata.json

# Create content file
cp app_data/templates/module_content_template.json \
   app_data/domains/materi/modules/module_001/content.json

# Edit content with actual learning material
nano app_data/domains/materi/modules/module_001/content.json

# Add images to assets folder
mkdir app_data/domains/materi/modules/module_001/assets
# Copy your images here
```

### 2️⃣ Adding an Exam Set to EXAM_ASLI Domain

```bash
# Create exam folder
mkdir app_data/domains/exam_asli/exam_sets/exam_asli_001

# Copy templates
cp app_data/templates/exam_set_template.json \
   app_data/domains/exam_asli/exam_sets/exam_asli_001/metadata.json

cp app_data/templates/exam_questions_template.json \
   app_data/domains/exam_asli/exam_sets/exam_asli_001/questions.json

# Edit files with your exam data
nano app_data/domains/exam_asli/exam_sets/exam_asli_001/metadata.json
nano app_data/domains/exam_asli/exam_sets/exam_asli_001/questions.json
```

### 3️⃣ Adding an AI Question Set to BANK_SOAL_AI Domain

```bash
# Create AI question set folder
mkdir app_data/domains/bank_soal_ai/question_sets/aibank_001

# Copy templates
cp app_data/templates/ai_question_set_template.json \
   app_data/domains/bank_soal_ai/question_sets/aibank_001/metadata.json

# For now, create empty questions.json
# AI generation will populate this later
echo '{"question_set_id": "aibank_001", "questions": []}' > \
   app_data/domains/bank_soal_ai/question_sets/aibank_001/questions.json
```

### 4️⃣ Generate Content Index

After adding modules/exams/questions:

```bash
# Generate the master content index
node scripts/generate_content_index.js

# This will:
# ✅ Scan all 3 domains
# ✅ Count modules, exams, questions
# ✅ Generate app_data/runtime/content_index.generated.json
# ✅ Print summary statistics
```

---

## File Structure Reference

```
MATERI DOMAIN (Learning Content)
├── modules/
│   ├── module_001/
│   │   ├── metadata.json          ← Module info, order, duration
│   │   ├── content.json           ← Actual learning material
│   │   └── assets/
│   │       ├── img_001.png
│   │       ├── img_002.png
│   │       └── model_3d_001.glb
│   ├── module_002/
│   └── ...
├── shared_assets/                 ← Optional shared resources
│   ├── images/
│   └── models_3d/
└── metadata.json                  ← Domain-level config

EXAM_ASLI DOMAIN (Real Exams)
├── exam_sets/
│   ├── exam_asli_001/
│   │   ├── metadata.json          ← Exam info, date, duration
│   │   └── questions.json         ← All 60 questions
│   ├── exam_asli_002/
│   └── ...
└── metadata.json                  ← Domain-level config

BANK_SOAL_AI DOMAIN (AI Practice)
├── question_sets/
│   ├── aibank_001/
│   │   ├── metadata.json          ← Generation config
│   │   └── questions.json         ← AI-generated questions
│   ├── aibank_002/
│   └── ...
└── metadata.json                  ← Domain-level config
```

---

## Module Content Example

### metadata.json
```json
{
  "module_id": "module_001",
  "order": 1,
  "title": "Stroke Pathophysiology",
  "subtitle": "Understanding Acute Stroke Mechanisms",
  "description": "Comprehensive study of stroke types, causes, and pathophysiology",
  "status": "published",
  "metadata": {
    "duration_minutes": 60,
    "source_file": "Slide_Neuro_01_Stroke.pptx",
    "instructor": "Dr. Habib Arsy"
  },
  "structure": {
    "learning_goals": [
      "Understand stroke classification",
      "Describe pathophysiology of ischemic vs hemorrhagic stroke"
    ],
    "glossary_terms": 15,
    "visual_assets_count": 5
  },
  "assets": {
    "images": ["img_stroke_01.png", "img_stroke_02.png"]
  }
}
```

### content.json
```json
{
  "module_id": "module_001",
  "expanded_sections": [
    {
      "section_id": "s01",
      "heading": "Ischemic Stroke",
      "content_blocks": [
        {
          "type": "paragraph",
          "text": "Ischemic stroke occurs when a blood vessel supplying the brain is blocked..."
        },
        {
          "type": "list",
          "items": [
            "Thrombotic stroke",
            "Embolic stroke",
            "Lacunar stroke"
          ]
        },
        {
          "type": "image_ref",
          "asset_id": "img_stroke_01.png",
          "caption": "MRI showing acute ischemic stroke"
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Time Critical",
          "content": "Every minute counts. Thrombolytic therapy is time-sensitive."
        }
      ]
    }
  ],
  "key_points": [
    "80% of strokes are ischemic",
    "Tissue plasminogen activator (tPA) window: 4.5 hours",
    "Mechanical thrombectomy window: 24 hours"
  ],
  "glossary_refs": [
    {
      "term": "Ischemia",
      "meaning": "Inadequate blood supply to an organ or tissue",
      "usage_context": "Core concept in stroke pathophysiology"
    }
  ]
}
```

---

## Exam Set Example

### metadata.json
```json
{
  "exam_set_id": "exam_asli_001",
  "order": 1,
  "title": "Ujian Blok Neurologi 2025",
  "description": "Official block exam - Neurology",
  "metadata": {
    "exam_date": "2025-05-15",
    "duration_minutes": 120,
    "passing_score": 70,
    "total_questions": 60
  }
}
```

### questions.json
```json
{
  "exam_set_id": "exam_asli_001",
  "questions": [
    {
      "number": 1,
      "stem": "Seorang pasien laki-laki usia 45 tahun dengan kelemahan mendadak lengan kanan dan kesulitan bicara. Di mana lesi terjadi?",
      "options": [
        "Area Broca (Lobus Frontalis Kiri)",
        "Area Wernicke (Lobus Temporalis Kiri)",
        "Gyrus Precentralis Kiri",
        "Lobus Occipitalis Kiri"
      ],
      "answer_index": 0,
      "explanation": "Lesi pada Area Broca menyebabkan afasia motorik (non-fluent aphasia)...",
      "confidence": "High-Yield",
      "answer_evidence": "Neurologi Klinis — Bab Afasia",
      "topics": ["aphasia", "stroke"],
      "difficulty": 2
    }
  ]
}
```

---

## AI Question Set Example

### metadata.json
```json
{
  "question_set_id": "aibank_001",
  "order": 1,
  "title": "AI Bank - Stroke Pathophysiology",
  "metadata": {
    "source_module": "module_001",
    "source_exam_set": "exam_asli_001",
    "difficulty": "intermediate",
    "total_questions": 60
  },
  "generation_params": {
    "source_materials": {
      "modules": ["module_001"],
      "exam_reference": "exam_asli_001"
    }
  }
}
```

### questions.json
Will be auto-populated by AI generation pipeline. Structure:
```json
{
  "question_set_id": "aibank_001",
  "questions": [
    {
      "number": 1,
      "stem": "AI-generated question...",
      "options": ["A", "B", "C", "D"],
      "answer_index": 0,
      "explanation": "AI-generated explanation...",
      "ai_metadata": {
        "source_references": [
          {"source_type": "module", "module_id": "module_001"}
        ]
      }
    }
  ]
}
```

---

## Content Types Supported

### Paragraph
```json
{ "type": "paragraph", "text": "Your paragraph text..." }
```

### List (Unordered/Ordered)
```json
{
  "type": "list",
  "subtype": "unordered",
  "items": [
    "Item 1",
    "Item 2",
    { "text": "Item 3", "subitems": ["Sub 1", "Sub 2"] }
  ]
}
```

### Image Reference
```json
{
  "type": "image_ref",
  "asset_id": "img_001.png",
  "caption": "Image caption",
  "width_percent": 100,
  "alignment": "center"
}
```

### Callout Box
```json
{
  "type": "callout",
  "tone": "info | success | warning | danger",
  "title": "Important",
  "content": "Callout text..."
}
```

### Code/Structured Content
```json
{
  "type": "code_block",
  "language": "text",
  "content": "Structured content..."
}
```

### Table
```json
{
  "type": "table",
  "headers": ["Column 1", "Column 2"],
  "rows": [
    ["Data 1", "Data 2"],
    ["Data 3", "Data 4"]
  ]
}
```

---

## Key Metadata Fields

### Module
- `module_id`: Unique ID (module_001, module_002, ...)
- `order`: Display order
- `status`: draft | published
- `duration_minutes`: Estimated learning time
- `source_file`: Original PPT file (for reference)

### Exam Set
- `exam_set_id`: Unique ID (exam_asli_001, ...)
- `order`: Display order
- `total_questions`: Number of questions (typically 60)
- `duration_minutes`: Total exam time (typically 60)
- `passing_score`: Required score to pass (typically 70)

### AI Question Set
- `question_set_id`: Unique ID (aibank_001, ...)
- `source_module`: Which module(s) to base generation on
- `source_exam_set`: Which exam set to reference
- `difficulty`: beginner | intermediate | advanced
- `total_questions`: Number to generate (default 60)

---

## Validation Checklist

Before running `generate_content_index.js`:

**For Each Module:**
- [ ] metadata.json exists and is valid JSON
- [ ] content.json exists and is valid JSON
- [ ] All asset_ids in content.json exist in assets/
- [ ] At least 2 learning goals defined
- [ ] At least 1 section with content blocks
- [ ] Glossary terms have meaning and context

**For Each Exam Set:**
- [ ] metadata.json exists and is valid JSON
- [ ] questions.json exists and is valid JSON
- [ ] All questions have: stem, options (4), answer_index, explanation
- [ ] answer_index is 0-3
- [ ] Confidence levels match allowed values
- [ ] Total questions matches metadata

**For Each AI Question Set:**
- [ ] metadata.json exists and is valid JSON
- [ ] source_module or source_exam_set is valid
- [ ] questions.json exists (can be empty initially)

---

## Automation & Next Steps

Once content structure is complete:

1. **Run index generator**: `node scripts/generate_content_index.js`
2. **Verify output**: Check `app_data/runtime/content_index.generated.json`
3. **Test in app**: Load app and verify content displays correctly
4. **Generate AI questions**: Run AI generation pipeline (batch_001, batch_002, etc.)
5. **Fine-tune**: Edit explanations and difficulty levels as needed
6. **Publish**: Mark modules/exams as "published" status

---

## Tips & Best Practices

✅ **DO:**
- Keep module IDs sequential and zero-padded (001, 002, ...)
- Use consistent naming for assets (img_001.png, not my_image.png)
- Include detailed explanations for exam questions
- Add glossary terms for all medical/technical vocabulary
- Test content in UI before finalizing

❌ **DON'T:**
- Mix domains in one folder
- Use special characters in file/folder names
- Leave modules with draft status in final app
- Forget to update metadata when adding content
- Mix English and Indonesian inconsistently

---

## Folder Structure Template

To get started quickly, use this structure:

```
app_data/
├── domains/
│   ├── materi/
│   │   ├── metadata.json
│   │   ├── modules/
│   │   │   ├── module_001/
│   │   │   │   ├── metadata.json
│   │   │   │   ├── content.json
│   │   │   │   └── assets/
│   │   │   ├── module_002/
│   │   │   └── ...
│   │   └── shared_assets/
│   ├── exam_asli/
│   │   ├── metadata.json
│   │   └── exam_sets/
│   │       ├── exam_asli_001/
│   │       │   ├── metadata.json
│   │       │   └── questions.json
│   │       └── ...
│   └── bank_soal_ai/
│       ├── metadata.json
│       └── question_sets/
│           ├── aibank_001/
│           │   ├── metadata.json
│           │   └── questions.json
│           └── ...
├── runtime/
│   └── content_index.generated.json  (AUTO-GENERATED)
└── templates/
    ├── module_template.json
    ├── module_content_template.json
    ├── exam_set_template.json
    ├── exam_questions_template.json
    └── ai_question_set_template.json
```

---

## Questions?

Refer to:
- **Schema Details**: DOMAIN_SCHEMA_DESIGN.md
- **Architecture Overview**: RESOURCE_ARCHITECTURE.md
- **Implementation Status**: FEATURE_AUDIT.md

Content ready to be created anytime! 🚀
