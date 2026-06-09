# 📐 CORTEX-SHELL 3-DOMAIN SCHEMA DESIGN

## Architecture Overview

```
app_data/
├── domains/
│   ├── materi/              # Domain 1: Learning Content
│   │   ├── metadata.json
│   │   ├── modules/
│   │   │   ├── module_001/
│   │   │   ├── module_002/
│   │   │   └── ...
│   │   └── shared_assets/   # Images, 3D models referenced by modules
│   │
│   ├── exam_asli/           # Domain 2: Real Exam Questions
│   │   ├── metadata.json
│   │   └── exam_sets/
│   │       ├── exam_asli_001/
│   │       ├── exam_asli_002/
│   │       └── ...
│   │
│   └── bank_soal_ai/        # Domain 3: AI-Generated Questions
│       ├── metadata.json
│       └── question_sets/
│           ├── aibank_001/
│           ├── aibank_002/
│           └── ...
│
├── runtime/
│   ├── content_index.generated.json    # Master index (generated)
│   ├── visual_asset_manifest.json      # Asset registry (generated)
│   └── domain_registry.json            # Domain metadata cache
│
└── templates/
    ├── module_template.json
    ├── exam_set_template.json
    └── ai_question_set_template.json
```

---

## 1️⃣ DOMAIN METADATA SCHEMA

### `domains/materi/metadata.json`
```json
{
  "domain_id": "materi",
  "domain_type": "learning_content",
  "display_name": "Materi Pembelajaran",
  "display_name_en": "Learning Materials",
  "description": "Konten pembelajaran dari slide dosen dan modul terstruktur",
  "icon": "📚",
  "color_theme": "blue",
  "color_hex": "#3b82f6",
  "version": "1.0.0",
  "created_date": "2026-06-09",
  "last_updated": "2026-06-09",
  "metadata": {
    "source": "university_slides",
    "subject_area": "Neurology",
    "academic_year": 2026,
    "semester": 1,
    "total_modules": 0,
    "total_hours": 0,
    "language": "id",
    "instructor": "Dr. Habib Arsy"
  },
  "module_config": {
    "naming_convention": "module_NNN",
    "auto_increment": true,
    "starting_number": 1,
    "zero_padded": true,
    "padding_digits": 3
  },
  "features": {
    "supports_glossary": true,
    "supports_visual_assets": true,
    "supports_3d_models": true,
    "supports_sections": true,
    "supports_key_points": true,
    "supports_learning_goals": true
  }
}
```

### `domains/exam_asli/metadata.json`
```json
{
  "domain_id": "exam_asli",
  "domain_type": "assessment_authentic",
  "display_name": "Ujian Asli",
  "display_name_en": "Authentic Exams",
  "description": "Soal ujian asli dari universitas, tidak dimodifikasi",
  "icon": "📝",
  "color_theme": "amber",
  "color_hex": "#f59e0b",
  "version": "1.0.0",
  "created_date": "2026-06-09",
  "last_updated": "2026-06-09",
  "metadata": {
    "source": "university_official",
    "subject_area": "Neurology",
    "exam_type": "block_exam",
    "total_sets": 0,
    "total_questions": 0,
    "language": "id",
    "difficulty_levels": ["High-Yield", "Kunci", "Clinical Reasoning"]
  },
  "exam_set_config": {
    "naming_convention": "exam_asli_NNN",
    "auto_increment": true,
    "starting_number": 1,
    "zero_padded": true,
    "padding_digits": 3
  },
  "features": {
    "supports_confidence_level": true,
    "supports_evidence_citation": true,
    "supports_detailed_explanation": true,
    "supports_image_references": true,
    "supports_tagging": true,
    "can_generate_ai_bank": true
  }
}
```

### `domains/bank_soal_ai/metadata.json`
```json
{
  "domain_id": "bank_soal_ai",
  "domain_type": "practice_generated",
  "display_name": "Bank Soal AI",
  "display_name_en": "AI Question Bank",
  "description": "Soal latihan yang di-generate oleh AI berdasarkan materi dan ujian asli",
  "icon": "🤖",
  "color_theme": "purple",
  "color_hex": "#a855f7",
  "version": "1.0.0",
  "created_date": "2026-06-09",
  "last_updated": "2026-06-09",
  "metadata": {
    "source": "ai_generated",
    "generation_model": "cortex_ai_engine",
    "source_domains": ["materi", "exam_asli"],
    "total_sets": 0,
    "total_questions": 0,
    "language": "id",
    "difficulty_range": ["beginner", "intermediate", "advanced"]
  },
  "question_set_config": {
    "naming_convention": "aibank_NNN",
    "auto_increment": true,
    "starting_number": 1,
    "zero_padded": true,
    "padding_digits": 3,
    "default_questions_per_set": 60,
    "default_time_per_question_minutes": 1
  },
  "generation_config": {
    "enabled": true,
    "auto_regenerate_on_materi_update": false,
    "required_source_modules": 1,
    "variation_count": 3
  },
  "features": {
    "supports_difficulty_level": true,
    "supports_ai_hints": true,
    "supports_topic_clustering": true,
    "supports_adaptive_generation": true,
    "supports_performance_tracking": true,
    "can_regenerate": true
  }
}
```

---

## 2️⃣ MODULE STRUCTURE SCHEMA

### `domains/materi/modules/module_001/metadata.json`
```json
{
  "module_id": "module_001",
  "domain_id": "materi",
  "order": 1,
  "title": "Module Title Here",
  "subtitle": "Optional subtitle",
  "description": "Short description of module content",
  "version": "1.0.0",
  "status": "draft | ready | published",
  "metadata": {
    "duration_minutes": 45,
    "learning_level": "intermediate",
    "language": "id",
    "source_type": "ppt_extraction",
    "source_file": "Slide_Dosen_Module_01.pptx",
    "instructor": "Dr. Name",
    "created_date": "2026-06-09",
    "last_updated": "2026-06-09"
  },
  "structure": {
    "learning_goals": [
      "Learning goal 1",
      "Learning goal 2"
    ],
    "key_sections": [
      { "section_id": "s01", "order": 1 },
      { "section_id": "s02", "order": 2 }
    ],
    "summary_points": 5,
    "glossary_terms": 10,
    "visual_assets_count": 3,
    "3d_models_count": 1
  },
  "content_file": "content.json",
  "assets": {
    "images": ["img_001.png", "img_002.png"],
    "models_3d": ["brain_model_001.glb"],
    "documents": []
  }
}
```

### `domains/materi/modules/module_001/content.json`
```json
{
  "module_id": "module_001",
  "expanded_sections": [
    {
      "section_id": "s01",
      "order": 1,
      "heading": "Section Heading",
      "subheading": "Optional subheading",
      "content_blocks": [
        {
          "type": "paragraph",
          "text": "Paragraph text content..."
        },
        {
          "type": "list",
          "subtype": "unordered | ordered",
          "items": [
            "Item 1",
            "Item 2 with nested items",
            {
              "text": "Item 3",
              "subitems": ["Sub 1", "Sub 2"]
            }
          ]
        },
        {
          "type": "image_ref",
          "asset_id": "img_001.png",
          "caption": "Optional image caption",
          "width_percent": 100,
          "alignment": "center"
        },
        {
          "type": "callout",
          "tone": "info | success | warning | danger",
          "title": "Important",
          "content": "Callout text"
        },
        {
          "type": "code_block",
          "language": "text",
          "content": "Code or structured content"
        },
        {
          "type": "table",
          "headers": ["Column 1", "Column 2"],
          "rows": [
            ["Data 1", "Data 2"]
          ]
        }
      ]
    }
  ],
  "key_points": [
    "Key point 1",
    "Key point 2"
  ],
  "glossary_refs": [
    {
      "term": "Medical Term",
      "meaning": "Definition of term",
      "usage_context": "Where used in this module"
    }
  ]
}
```

---

## 3️⃣ EXAM SET STRUCTURE SCHEMA

### `domains/exam_asli/exam_sets/exam_asli_001/metadata.json`
```json
{
  "exam_set_id": "exam_asli_001",
  "domain_id": "exam_asli",
  "order": 1,
  "title": "Ujian Blok Neurology 2025",
  "subtitle": "Session 1 - Morning",
  "description": "Ujian asli blok neurologi tahun 2025",
  "version": "1.0.0",
  "status": "published",
  "metadata": {
    "exam_date": "2025-05-15",
    "duration_minutes": 120,
    "total_questions": 60,
    "passing_score": 70,
    "language": "id",
    "source": "Universitas XYZ",
    "created_date": "2026-06-09",
    "last_updated": "2026-06-09"
  },
  "statistics": {
    "difficulty_distribution": {
      "High-Yield": 20,
      "Kunci": 25,
      "Clinical Reasoning": 15
    },
    "topic_coverage": {
      "topic_1": 15,
      "topic_2": 20,
      "topic_3": 25
    }
  },
  "question_file": "questions.json"
}
```

### `domains/exam_asli/exam_sets/exam_asli_001/questions.json`
```json
{
  "exam_set_id": "exam_asli_001",
  "questions": [
    {
      "number": 1,
      "stem": "Question text here...",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer_index": 0,
      "explanation": "Detailed explanation of why A is correct...",
      "confidence": "High-Yield | Kunci | Clinical Reasoning",
      "answer_evidence": "Reference source (e.g., Textbook Chapter 5)",
      "topics": ["topic_1", "topic_2"],
      "difficulty": 2,
      "image_ref": null,
      "metadata": {
        "created_date": "2025-05-15",
        "extracted_by": "Dr. Name",
        "verified": true
      }
    }
  ]
}
```

---

## 4️⃣ AI QUESTION SET STRUCTURE SCHEMA

### `domains/bank_soal_ai/question_sets/aibank_001/metadata.json`
```json
{
  "question_set_id": "aibank_001",
  "domain_id": "bank_soal_ai",
  "order": 1,
  "title": "AI Generated Questions - Stroke Pathophysiology",
  "subtitle": "Difficulty: Intermediate",
  "description": "60 soal yang di-generate AI berdasarkan modul Stroke",
  "version": "1.0.0",
  "status": "published",
  "metadata": {
    "generated_date": "2026-06-09",
    "generation_model": "cortex_ai_v1",
    "source_module": "module_002",
    "source_exam_set": "exam_asli_001",
    "difficulty": "intermediate",
    "total_questions": 60,
    "time_per_question_minutes": 1,
    "language": "id",
    "created_date": "2026-06-09",
    "last_updated": "2026-06-09"
  },
  "generation_params": {
    "source_materials": {
      "modules": ["module_001", "module_002"],
      "exam_reference": "exam_asli_001"
    },
    "question_types": ["multiple_choice"],
    "topic_distribution": {
      "topic_1": 20,
      "topic_2": 25,
      "topic_3": 15
    },
    "difficulty_distribution": {
      "beginner": 20,
      "intermediate": 40,
      "advanced": 0
    },
    "variation_seed": 12345,
    "regeneration_available": true
  },
  "statistics": {
    "average_difficulty": 2.2,
    "average_option_clarity": 4.5,
    "ai_validation_score": 0.92
  },
  "question_file": "questions.json"
}
```

### `domains/bank_soal_ai/question_sets/aibank_001/questions.json`
```json
{
  "question_set_id": "aibank_001",
  "questions": [
    {
      "number": 1,
      "stem": "AI-generated question based on source materials...",
      "options": [
        "AI-generated option A",
        "AI-generated option B",
        "AI-generated option C",
        "AI-generated option D"
      ],
      "answer_index": 2,
      "explanation": "AI-generated explanation with citations to source materials...",
      "confidence": "generated",
      "answer_evidence": "Source: Module 001 - Section s02, based on Exam Asli 001 Question 5",
      "topics": ["topic_1"],
      "difficulty": 2,
      "ai_metadata": {
        "generation_method": "retrieval_augmented_generation",
        "source_references": [
          {
            "source_type": "module",
            "module_id": "module_001",
            "section_id": "s02"
          },
          {
            "source_type": "exam",
            "exam_set_id": "exam_asli_001",
            "question_number": 5
          }
        ],
        "variation_index": 0,
        "validation_score": 0.95
      }
    }
  ]
}
```

---

## 5️⃣ MASTER CONTENT INDEX SCHEMA

### `app_data/runtime/content_index.generated.json`
```json
{
  "generatedAt": "2026-06-09T10:30:00Z",
  "version": "2.0.0",
  "domains": [
    {
      "id": "materi",
      "type": "learning_content",
      "title": "Materi Pembelajaran",
      "icon": "📚",
      "color": "#3b82f6",
      "moduleCount": 5,
      "totalHours": 15,
      "modules": [
        {
          "id": "module_001",
          "title": "Module 1 Title",
          "order": 1,
          "status": "published",
          "durationMinutes": 45,
          "visualAssetCount": 3,
          "glossaryTermCount": 10
        }
      ],
      "metadata": {
        "subject": "Neurology",
        "academicYear": 2026,
        "instructor": "Dr. Name"
      }
    },
    {
      "id": "exam_asli",
      "type": "assessment_authentic",
      "title": "Ujian Asli",
      "icon": "📝",
      "color": "#f59e0b",
      "examSetCount": 2,
      "questionCount": 120,
      "examSets": [
        {
          "id": "exam_asli_001",
          "title": "Ujian Blok 2025",
          "order": 1,
          "questionCount": 60,
          "durationMinutes": 60,
          "passingScore": 70
        }
      ],
      "metadata": {
        "source": "university_official",
        "examType": "block_exam"
      }
    },
    {
      "id": "bank_soal_ai",
      "type": "practice_generated",
      "title": "Bank Soal AI",
      "icon": "🤖",
      "color": "#a855f7",
      "questionSetCount": 3,
      "questionCount": 180,
      "questionSets": [
        {
          "id": "aibank_001",
          "title": "AI Bank 1 - Intermediate",
          "order": 1,
          "questionCount": 60,
          "difficulty": "intermediate",
          "sourceModule": "module_001",
          "sourceExam": "exam_asli_001"
        }
      ],
      "metadata": {
        "generationModel": "cortex_ai_v1",
        "lastGenerated": "2026-06-09"
      }
    }
  ],
  "stats": {
    "totalDomains": 3,
    "totalModules": 5,
    "totalExamSets": 2,
    "totalQuestions": 300,
    "lastUpdate": "2026-06-09T10:30:00Z"
  }
}
```

---

## 6️⃣ VISUAL ASSET MANIFEST SCHEMA

### `app_data/runtime/visual_asset_manifest.json`
```json
{
  "generatedAt": "2026-06-09T10:30:00Z",
  "assets": [
    {
      "asset_id": "img_neuro_001",
      "type": "anatomy_diagram",
      "title": "Brain Anatomy - Lobes",
      "file_path": "domains/materi/modules/module_001/assets/img_001.png",
      "dimensions": { "width": 1200, "height": 800 },
      "file_size_kb": 250,
      "format": "png",
      "domain_ids": ["materi"],
      "module_ids": ["module_001"],
      "surface_ids": [3, 4, 9, 12],
      "tags": ["anatomy", "brain", "neuroanatomy"],
      "created_date": "2026-06-09",
      "usage_count": 1
    },
    {
      "asset_id": "model_3d_brain_001",
      "type": "3d_model",
      "title": "Human Brain 3D Model",
      "file_path": "domains/materi/modules/module_001/assets/brain_model_001.glb",
      "file_size_kb": 5000,
      "format": "glb",
      "domain_ids": ["materi"],
      "module_ids": ["module_001"],
      "surface_ids": [13],
      "interactive_hotspots": [
        {
          "id": "brocas_area",
          "label": "Broca's Area",
          "tooltip": "Speech production"
        }
      ],
      "tags": ["anatomy", "3d", "brain"],
      "created_date": "2026-06-09",
      "usage_count": 1
    }
  ],
  "statistics": {
    "total_assets": 50,
    "by_type": {
      "anatomy_diagram": 30,
      "clinical_photo": 15,
      "3d_model": 5
    },
    "total_size_mb": 2500
  }
}
```

---

## 7️⃣ NAMING CONVENTIONS & AUTO-INCREMENT

### Naming Patterns
```
DOMAIN MATERI:
- Module: module_001, module_002, ... module_999
- Asset folder: {module_id}/assets/
- Image: img_001.png, img_002.png, ...
- 3D Model: model_3d_001.glb, model_3d_002.glb, ...

DOMAIN EXAM ASLI:
- Exam set: exam_asli_001, exam_asli_002, ... exam_asli_999
- Questions file: {exam_set_id}/questions.json

DOMAIN BANK SOAL AI:
- Question set: aibank_001, aibank_002, ... aibank_999
- Questions file: {question_set_id}/questions.json
```

### Auto-Increment Logic
```javascript
function getNextModuleId(domainId) {
  // Find highest numbered module
  // Return next zero-padded ID
  // e.g., if module_005 exists → return module_006
}

function getNextExamSetId(domainId) {
  // Same logic for exam_asli and bank_soal_ai
}
```

---

## 8️⃣ SCHEMA VALIDATION RULES

### Module Validation
- ✅ Must have unique module_id per domain
- ✅ Content file must be valid JSON
- ✅ All asset_ids must exist in manifest
- ✅ Glossary terms must not be empty
- ✅ Learning goals required (min 2)

### Exam Set Validation
- ✅ Must have unique exam_set_id per domain
- ✅ Question count must be ≥ 1
- ✅ answer_index must be 0-3
- ✅ All questions must have explanation
- ✅ confidence level must match allowed values

### AI Question Set Validation
- ✅ Must have source_module or source_exam_set
- ✅ Question count typically 60 (configurable)
- ✅ All questions must have AI metadata
- ✅ Source references must point to valid content
- ✅ Validation score must be ≥ 0.8

---

## 9️⃣ FLEXIBILITY & SCALABILITY

### Variable Module Count
```json
{
  "domain_id": "materi",
  "metadata": {
    "total_modules": 0  // Can be any number
  },
  "module_config": {
    "auto_increment": true  // Auto-discovers modules
  }
}
```

### Variable Content Sources
```json
{
  "source_type": "ppt_extraction | raw_questions | ai_generated | manual",
  "source_file": "optional_reference_file.pptx"
}
```

### Extensible Content Blocks
```json
{
  "content_blocks": [
    { "type": "paragraph" },
    { "type": "list" },
    { "type": "image_ref" },
    { "type": "callout" },
    { "type": "code_block" },
    { "type": "table" },
    // Easy to add: "type": "video_ref", "type": "interactive_quiz", etc.
  ]
}
```

---

## 🔟 IMPLEMENTATION STEPS

1. **Create directory structure** (auto-create if doesn't exist)
2. **Copy metadata.json files** to each domain folder
3. **Create content templates** for easy module/exam creation
4. **Write index generator script** to scan domains and build content_index.json
5. **Implement validation** to ensure all content follows schema
6. **Setup asset discovery** to find and register all visual assets
7. **Test with sample content** before final app creation
8. **Document API** for accessing content at runtime

---

## 🎯 BENEFITS OF THIS SCHEMA

✅ **Flexible**: Variable module/exam/question counts  
✅ **Scalable**: Easy to add new domains or modules  
✅ **Maintainable**: Clear structure with consistent naming  
✅ **Generatable**: AI can easily create new content  
✅ **Indexable**: Fast lookup via content_index.json  
✅ **Validatable**: Schema rules ensure consistency  
✅ **Extensible**: Easy to add new content types  
✅ **Traceable**: Metadata tracks sources and versions  

---

## 📝 NEXT: Create directory structure and implement index generator script
