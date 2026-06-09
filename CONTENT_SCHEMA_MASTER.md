# 🎯 CORTEX-SHELL CONTENT SCHEMA MASTER

## Overview

Total Surfaces/Pages yang perlu schema konten: **20**
- 2 Main Pages (0, 1)
- 18 Active Surfaces (2-23, excluding 5, 8, 20, 21)

---

## 📊 CONTENT INVENTORY & MAPPING

### Pages (2)
| ID | Label | Type | Content Type | Customizable | Status |
|----|-------|------|--------------|--------------|--------|
| 0 | Main Studio | Page | Navigation Hub | Anchor | Always Active |
| 1 | Welcome | Page | Onboarding | Both | Entry Point |

### Surfaces - Foundation Group (3)
| ID | Label | Type | Content Type | Customizable | Source |
|----|-------|------|--------------|--------------|--------|
| 2 | Home Dashboard | Surface | Hero + Quick Actions | Full | Domain Materi |
| 3 | Learning Surface | Surface | Lesson Flow + Metadata | Full | Domain Materi |
| 4 | Slide Detail | Surface | Content Panel + Assets | Full | Domain Materi |

### Surfaces - Discover Group (2)
| ID | Label | Type | Content Type | Customizable | Source |
|----|-------|------|--------------|--------------|--------|
| 6 | Search | Surface | Indexed Content Lookup | Anchor | Generated Index |
| 7 | Settings | Surface | User Preferences | Anchor | Config Files |

### Surfaces - Review Group (4)
| ID | Label | Type | Content Type | Customizable | Source |
|----|-------|------|--------------|--------------|--------|
| 9 | Typography Reading | Surface | Prose Content | Full | Domain Materi |
| 10 | Bullet Content | Surface | Structured Points | Full | Domain Materi |
| 11 | Clinical Pearl | Surface | Callouts + Tips | Full | Domain Materi |
| 12 | Image Cards | Surface | Visual Library | Full | Domain Materi + Assets |

### Surfaces - Reference Group (4)
| ID | Label | Type | Content Type | Customizable | Source |
|----|-------|------|--------------|--------------|--------|
| 13 | Media Viewer | Surface | 3D Models + Visuals | Full | Assets + Domain Materi |
| 14 | Glossary | Surface | Terms + Definitions | Full | Domain Materi |
| 15 | Quick Summary | Surface | Key Points | Full | Domain Materi |
| 16 | Bilingual | Surface | Dual Language Explanation | Full | Domain Materi |

### Surfaces - Practice Group (3)
| ID | Label | Type | Content Type | Customizable | Source |
|----|-------|------|--------------|--------------|--------|
| 17 | Quiz | Surface | Questions + Feedback | Full | Domain Exam Asli + AI Bank |
| 18 | Flashcard | Surface | Card Pairs | Full | Domain Exam Asli + AI Bank |
| 19 | Progress Dashboard | Surface | Metrics + Tracking | Anchor | User Data + Config |

### Surfaces - Utilities Group (2)
| ID | Label | Type | Content Type | Customizable | Source |
|----|-------|------|--------------|--------------|--------|
| 22 | QuickRef Modal | Surface | Reference Lookup | Full | Domain Materi |
| 23 | Help & Info | Surface | Static Content + States | Both | Config + App States |

---

## 🎯 CUSTOMIZABLE vs ANCHOR

### Anchor Content (System-level, don't customize):
- Page 0: Main Studio (navigation)
- Page 1: Welcome (entry flow)
- Surface 6: Search (generated automatically)
- Surface 7: Settings (system config)
- Surface 19: Progress Dashboard (user data)

### Fully Customizable Content (per domain/app):
- Surface 2-4: Foundation (home, learning, detail)
- Surface 9-18: Review, Reference, Practice
- Surface 22: QuickRef
- Surface 23: Help & Info

---

## 📦 BATCH DISTRIBUTION (3 Batches)

### Batch 1: Foundation + Discover (6 surfaces/pages)
**Priority: HIGH** — Critical path surfaces
- Page 0: Main Studio (system)
- Page 1: Welcome (system)
- Surface 2: Home Dashboard
- Surface 3: Learning Surface
- Surface 4: Slide Detail
- Surface 6: Search (auto)
- Surface 7: Settings (system)

**Content Requirement:** Module metadata + overview + learning goals
**Estimated Content Items:** 50-100
**Timeline:** Weeks 1-2

### Batch 2: Review + Reference (8 surfaces)
**Priority: HIGH** — Main content delivery
- Surface 9: Typography Reading
- Surface 10: Bullet Content
- Surface 11: Clinical Pearl
- Surface 12: Image Cards
- Surface 13: Media Viewer
- Surface 14: Glossary
- Surface 15: Quick Summary
- Surface 16: Bilingual

**Content Requirement:** Full module content + sections + visuals
**Estimated Content Items:** 200-400
**Timeline:** Weeks 3-4

### Batch 3: Practice + Utilities (5 surfaces)
**Priority: MEDIUM** — Assessment + Support
- Surface 17: Quiz
- Surface 18: Flashcard
- Surface 19: Progress (system)
- Surface 22: QuickRef
- Surface 23: Help & Info

**Content Requirement:** Questions + explanations + reference materials
**Estimated Content Items:** 100-150
**Timeline:** Weeks 5-6

---

## 📋 CONTENT SCHEMA PER SURFACE

### BATCH 1 SURFACES

#### Surface 2: Home Dashboard
```json
{
  "surface_id": 2,
  "domain": "materi",
  "content_type": "hero_with_quick_actions",
  "required_fields": {
    "hero_title": "string",
    "hero_subtitle": "string",
    "hero_image": "asset_id",
    "quick_actions": [
      {
        "id": "string",
        "label": "string",
        "icon": "emoji|icon_name",
        "target_surface": "number",
        "description": "string"
      }
    ],
    "featured_content": [
      {
        "type": "module|section|quiz",
        "id": "string",
        "title": "string",
        "progress": "number (0-100)"
      }
    ],
    "stats": {
      "modules_total": "number",
      "modules_completed": "number",
      "quiz_average": "number"
    }
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 3: Learning Surface
```json
{
  "surface_id": 3,
  "domain": "materi",
  "content_type": "lesson_flow_with_metadata",
  "required_fields": {
    "module_id": "string",
    "module_title": "string",
    "module_subtitle": "string",
    "overview": "string (100-300 words)",
    "learning_goals": ["string"],
    "sections": [
      {
        "section_id": "string",
        "order": "number",
        "heading": "string",
        "subheading": "string",
        "estimated_time": "number (minutes)"
      }
    ],
    "progress_tracking": {
      "current_section": "number",
      "completion_percent": "number"
    },
    "nav_buttons": {
      "previous": "bool",
      "next": "bool",
      "jump_to_section": "bool"
    }
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 4: Slide Detail
```json
{
  "surface_id": 4,
  "domain": "materi",
  "content_type": "detail_panel_with_assets",
  "required_fields": {
    "section_id": "string",
    "heading": "string",
    "subheading": "string",
    "content_blocks": [
      {
        "type": "paragraph|list|callout|table|image",
        "text": "string",
        "metadata": "object"
      }
    ],
    "visual_assets": [
      {
        "asset_id": "string",
        "type": "image|diagram|3d",
        "caption": "string",
        "source_ref": "string"
      }
    ],
    "references": {
      "glossary_refs": ["string"],
      "quiz_refs": ["string"],
      "source_refs": ["string"]
    },
    "sidebar": {
      "key_points": ["string"],
      "related_sections": ["string"]
    }
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 6: Search (SYSTEM)
```json
{
  "surface_id": 6,
  "domain": "system",
  "content_type": "indexed_search",
  "required_fields": {
    "search_index": "auto_generated",
    "indexed_content": [
      {
        "id": "string",
        "type": "section|glossary_term|quiz_question|visual",
        "title": "string",
        "domain": "string",
        "module_id": "string",
        "tags": ["string"]
      }
    ],
    "filters": {
      "by_domain": ["string"],
      "by_content_type": ["string"],
      "by_difficulty": ["string"]
    }
  },
  "customizable": false,
  "auto_generated": true
}
```

#### Surface 7: Settings (SYSTEM)
```json
{
  "surface_id": 7,
  "domain": "system",
  "content_type": "user_preferences",
  "required_fields": {
    "theme_selection": {
      "available_themes": ["string"],
      "current_theme": "string"
    },
    "display_settings": {
      "font_size": "enum",
      "layout_mode": "enum",
      "motion_enabled": "boolean",
      "haptic_enabled": "boolean",
      "sound_enabled": "boolean"
    },
    "learning_settings": {
      "daily_goal": "number",
      "notification_enabled": "boolean",
      "show_hints": "boolean"
    },
    "privacy_settings": {
      "data_tracking": "boolean",
      "analytics": "boolean"
    }
  },
  "customizable": false,
  "system_config": true
}
```

---

### BATCH 2 SURFACES

#### Surface 9: Typography Reading
```json
{
  "surface_id": 9,
  "domain": "materi",
  "content_type": "detailed_prose",
  "required_fields": {
    "section_id": "string",
    "heading": "string",
    "subheading": "string",
    "content_paragraphs": [
      {
        "order": "number",
        "text": "string (200-500 words of detailed prose)"
      }
    ],
    "visual_references": ["string"],
    "callouts": [
      {
        "type": "info|warning|important",
        "text": "string"
      }
    ],
    "tables": [
      {
        "table_id": "string",
        "title": "string",
        "columns": ["string"],
        "rows": [["string"]]
      }
    ],
    "glossary_hover_terms": ["string"]
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 10: Bullet Content
```json
{
  "surface_id": 10,
  "domain": "materi",
  "content_type": "structured_bullets",
  "required_fields": {
    "section_id": "string",
    "heading": "string",
    "bullet_structure": [
      {
        "level": "number (1-3)",
        "text": "string (informative, complete sentence)",
        "emphasis": "none|bold|important"
      }
    ],
    "key_takeaways": ["string"],
    "visual_reference": ["string"],
    "related_glossary": ["string"]
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 11: Clinical Pearl
```json
{
  "surface_id": 11,
  "domain": "materi",
  "content_type": "callouts_and_tips",
  "required_fields": {
    "pearls": [
      {
        "pearl_id": "string",
        "type": "exam_tip|clinical|mnemonik|warning|radiology|surgical",
        "title": "string",
        "content": "string (1-2 sentences)",
        "visual_ref": "asset_id|null",
        "icon": "emoji"
      }
    ],
    "section_mapping": [
      {
        "section_id": "string",
        "relevant_pearls": ["string"]
      }
    ]
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 12: Image Cards
```json
{
  "surface_id": 12,
  "domain": "materi",
  "content_type": "visual_library",
  "required_fields": {
    "image_collection": [
      {
        "asset_id": "string",
        "title": "string",
        "description": "string",
        "visual_type": "anatomy|clinical|diagram|infographic",
        "file_path": "string",
        "tags": ["string"],
        "related_sections": ["string"],
        "teaching_point": "string"
      }
    ],
    "filters": {
      "by_type": ["string"],
      "by_section": ["string"],
      "by_topic": ["string"]
    },
    "gallery_settings": {
      "grid_columns": "number",
      "card_size": "enum"
    }
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 13: Media Viewer
```json
{
  "surface_id": 13,
  "domain": "materi",
  "content_type": "3d_and_visual_reference",
  "required_fields": {
    "models_3d": [
      {
        "model_id": "string",
        "title": "string",
        "type": "anatomy|pathology",
        "file_path": "string (GLB/GLTF)",
        "interactive_hotspots": [
          {
            "id": "string",
            "label": "string",
            "tooltip": "string",
            "position": [0, 0, 0]
          }
        ],
        "teaching_notes": "string"
      }
    ],
    "reference_images": [
      {
        "image_id": "string",
        "title": "string",
        "file_path": "string",
        "description": "string"
      }
    ]
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 14: Glossary
```json
{
  "surface_id": 14,
  "domain": "materi",
  "content_type": "terms_and_definitions",
  "required_fields": {
    "glossary_terms": [
      {
        "term_id": "string",
        "term": "string",
        "pronunciation": "string|null",
        "meaning": "string (100-200 words)",
        "meaning_simple": "string (1-sentence simple version)",
        "usage_context": "string",
        "related_terms": ["string"],
        "section_refs": ["string"],
        "language_pair": {
          "id": "string",
          "en": "string",
          "id": "string"
        }
      }
    ],
    "search_enabled": true,
    "filter_by_section": true
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 15: Quick Summary
```json
{
  "surface_id": 15,
  "domain": "materi",
  "content_type": "condensed_key_points",
  "required_fields": {
    "module_id": "string",
    "summary_points": [
      {
        "order": "number",
        "point": "string (1-2 sentences, information dense)",
        "emphasis_level": "high|medium|low"
      }
    ],
    "key_takeaways_count": "number (8-15)",
    "next_step_suggestion": "surface_id",
    "related_visuals": ["string"],
    "mnemonics": ["string"]
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 16: Bilingual
```json
{
  "surface_id": 16,
  "domain": "materi",
  "content_type": "dual_language_explanation",
  "required_fields": {
    "section_id": "string",
    "explanation_pairs": [
      {
        "pair_id": "string",
        "id": "string",
        "en": "string",
        "complexity_level": "simple|intermediate|advanced"
      }
    ],
    "language_toggle": true,
    "glossary_support": true,
    "pronunciation_guide": "bool"
  },
  "customizable": true,
  "source_domain": "materi"
}
```

---

### BATCH 3 SURFACES

#### Surface 17: Quiz
```json
{
  "surface_id": 17,
  "domain": "exam",
  "content_type": "interactive_quiz",
  "required_fields": {
    "question": {
      "id": "string",
      "stem": "string",
      "stimulus": "string|null",
      "options": [
        {
          "id": "A|B|C|D|E",
          "text": "string",
          "is_correct": "boolean"
        }
      ]
    },
    "answer": {
      "correct_id": "string",
      "explanation_short": "string (1-2 sentences)",
      "explanation_long": "string (100+ words)",
      "supplementary_material": "string (200+ words)"
    },
    "metadata": {
      "difficulty": "mudah|sedang|sulit",
      "source": "string",
      "topic_tags": ["string"],
      "related_sections": ["string"]
    }
  },
  "customizable": true,
  "source_domain": "exam_asli|bank_soal_ai"
}
```

#### Surface 18: Flashcard
```json
{
  "surface_id": 18,
  "domain": "exam",
  "content_type": "spaced_repetition_cards",
  "required_fields": {
    "flashcard": {
      "id": "string",
      "front": "string (question/prompt)",
      "back": "string (answer/definition)",
      "hint": "string|null"
    },
    "metadata": {
      "difficulty": "mudah|sedang|sulit",
      "category": "string",
      "related_question_id": "string|null"
    },
    "tracking": {
      "times_shown": "number",
      "times_correct": "number",
      "last_reviewed": "date|null"
    }
  },
  "customizable": true,
  "source_domain": "exam_asli|bank_soal_ai"
}
```

#### Surface 19: Progress Dashboard (SYSTEM)
```json
{
  "surface_id": 19,
  "domain": "system",
  "content_type": "metrics_and_tracking",
  "required_fields": {
    "metrics": {
      "total_modules": "number",
      "modules_completed": "number",
      "completion_percent": "number",
      "current_streak": "number (days)",
      "total_quizzes": "number",
      "average_score": "number"
    },
    "progress_by_section": [
      {
        "section_id": "string",
        "name": "string",
        "completion": "number (0-100)"
      }
    ],
    "learning_insights": {
      "strongest_areas": ["string"],
      "areas_to_improve": ["string"],
      "recommended_next": "string"
    }
  },
  "customizable": false,
  "system_generated": true
}
```

#### Surface 22: QuickRef Modal
```json
{
  "surface_id": 22,
  "domain": "materi",
  "content_type": "quick_reference_lookup",
  "required_fields": {
    "reference_items": [
      {
        "ref_id": "string",
        "category": "string",
        "title": "string",
        "content": "string (concise)",
        "tags": ["string"],
        "pinnable": true
      }
    ],
    "categories": ["string"],
    "search_enabled": true,
    "pin_feature": true
  },
  "customizable": true,
  "source_domain": "materi"
}
```

#### Surface 23: Help & Info
```json
{
  "surface_id": 23,
  "domain": "system",
  "content_type": "static_content_and_states",
  "required_fields": {
    "sections": {
      "help": [
        {
          "id": "string",
          "title": "string",
          "content": "string",
          "category": "string"
        }
      ],
      "about": {
        "app_name": "string",
        "version": "string",
        "description": "string",
        "credits": "string"
      },
      "privacy": {
        "title": "string",
        "content": "string (full privacy policy)"
      }
    },
    "empty_states": {
      "no_content": "message",
      "loading": "message",
      "error": "message",
      "offline": "message"
    }
  },
  "customizable": true,
  "source_domain": "config"
}
```

---

## 🔗 CONTENT DEPENDENCIES

```
Domain Materi
  └─ Surfaces: 2, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 22

Domain Exam Asli
  └─ Surfaces: 17, 18

Domain Bank Soal AI (Generated)
  └─ Surfaces: 17, 18

System/Generated
  └─ Surfaces: 0, 1, 6, 7, 19, 23
```

---

## 📝 FIELD VALIDATION RULES

For each surface content:
- ✅ Required fields must not be empty
- ✅ Text fields: minimum character count (varies by field)
- ✅ Arrays: minimum/maximum item counts
- ✅ References: must point to existing IDs
- ✅ Assets: must reference valid file paths
- ✅ IDs: must follow naming convention

---

## Next Section: Refined Prompts + Batch 1 Details

[Continued in next part...]
