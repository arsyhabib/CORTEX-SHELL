# 🏗️ CORTEX-SHELL Resource Architecture

## 📊 DOMAIN STRUCTURE

Dari analisis surfaces, Anda membutuhkan **N Domain** (tergantung specialty):

```
└── Domain (Medical Specialty)
    ├── Modules (Learning Units)
    │   ├── Content (Materi)
    │   └── Visual Assets (Images/3D)
    ├── Exam Sets (Question Banks)
    └── Metadata (Progress Tracking)
```

**Rekomendasi struktur domain:**
- **Primary Domain**: 1 atau lebih (e.g., Neurology, Cardiology, etc.)
- **Setiap domain**: 4-8 modules per semester/batch
- **Setiap module**: 3-6 learning surfaces

---

## 🎯 RESOURCE MODALITIES YANG DIPERLUKAN

### ✅ **REQUIRED (3 Modalitas Utama)**

#### 1. **TEXT/MATERI** 📝
```
Mencakup:
├── Pembelajaran (Learning Content)
│   ├── Module overviews
│   ├── Expanded sections (main content)
│   ├── Key points & summaries
│   └── Glossary & definitions
│
├── Assessment (Question Sets)
│   ├── Quiz questions + answers
│   ├── Flashcard pairs (front/back)
│   ├── Case studies
│   └── Explanations & rationale
│
└── Identity & Metadata
    ├── Domain titles & descriptions
    ├── Learning goals
    ├── Tags & categories
    └── Progress tracking metadata
```

#### 2. **VISUAL/IMAGE** 🖼️
```
Mencakup:
├── Educational Graphics
│   ├── Anatomy diagrams
│   ├── Clinical illustrations
│   ├── Concept maps
│   └── Infographics
│
├── Reference Cards
│   ├── Clinical pearls (Surface 11)
│   ├── Image card library (Surface 12, ~50+ assets)
│   ├── Hero images (Surface 2 dashboard)
│   └── Thumbnail previews
│
└── UI Assets
    ├── Icons & badges
    ├── Branding assets
    └── Background images
```

#### 3. **3D/MEDIA** 🎬
```
Mencakup:
├── Anatomy Viewer (Surface 13)
│   ├── 3D models (GLTF/GLB format recommended)
│   ├── Bone/tissue structures
│   ├── Pathology variants
│   └── Interactive hotspots
│
└── Visual References
    ├── MRI/CT scan references
    ├── Clinical specimen images
    └── Endoscopic/microscopic views
```

---

## 📦 RESOURCES YANG DIPERLUKAN PER SURFACE

### **Foundation Group (Entry Points)**
| Surface | Resource Jenis | Detail |
|---------|---|---|
| **S2: Home Dashboard** | Text + Image | Hero message, quick actions, domain overview |
| **S3: Learning Surface** | Text + Image | Module content, lesson structure, visual hierarchy |
| **S4: Slide Detail** | Text + Image | Dense content panel, detailed explanations |

### **Learn Group (Discovery)**
| Surface | Resource Jenis | Detail |
|---------|---|---|
| **S6: Search** | Text (Metadata) | Searchable index, tags, categories |
| **S7: Settings** | Text | Config metadata only (NO custom content) |
| **S8: Motion** | *(DELETE - DEMO)* | N/A |

### **Review Group (Study)**
| Surface | Resource Jenis | Detail |
|---------|---|---|
| **S9: Typography** | Text | Medical reading materials (prosaic content) |
| **S10: Bullet** | Text | Structured bullets, nested lists |
| **S11: Pearl** | Text + Image | Short clinical reminders + badge image |
| **S12: Image Cards** | Image | 50+ visual assets with metadata |

### **Reference Group (Lookup)**
| Surface | Resource Jenis | Detail |
|---------|---|---|
| **S13: Media Viewer** | 3D + Image | 3D anatomy models + reference images |
| **S14: Glossary** | Text | Terms, definitions, usage context |
| **S15: Summary** | Text | Compressed recap/essentials |
| **S16: Bilingual** | Text | Dual language (ID/EN) explanations |

### **Practice Group (Assessment)**
| Surface | Resource Jenis | Detail |
|---------|---|---|
| **S17: Quiz** | Text | Multiple-choice questions + feedback |
| **S18: Flashcard** | Text | Card pairs (term/definition or Q&A) |
| **S19: Progress** | Text (Metadata) | Tracking schema, metrics definitions |

### **Ops/Support Group (Utility)**
| Surface | Resource Jenis | Detail |
|---------|---|---|
| **S22: QuickRef** | Text | Reference lookup data |
| **S23: Help/Privacy** | Text | Static content (about, help, privacy) |

---

## 💾 RESOURCE STORAGE STRUCTURE

### **Recommended Directory Layout:**

```
app_data/
├── domains/
│   ├── neurology/                    # Domain folder
│   │   ├── metadata.json             # Domain info
│   │   ├── modules/
│   │   │   ├── module_01/
│   │   │   │   ├── content.json      # Main material
│   │   │   │   ├── glossary.json     # Terms
│   │   │   │   └── assets/
│   │   │   │       ├── images/       # Relevant images
│   │   │   │       └── 3d/           # 3D models
│   │   │   ├── module_02/
│   │   │   └── ...
│   │   └── exams/
│   │       ├── quiz_01.json          # Quiz questions
│   │       ├── exam_asli_01.json     # Real exam
│   │       └── flashcards_01.json    # Card sets
│   │
│   ├── cardiology/                   # Another domain
│   └── ...
│
├── shared_assets/                    # Cross-domain assets
│   ├── visual/
│   │   ├── clinical_pearls/          # Surface 11 images
│   │   ├── image_cards/              # Surface 12 library
│   │   └── icons/
│   ├── 3d/
│   │   ├── anatomy_models/           # For Surface 13
│   │   └── pathology_variants/
│   └── branding/
│       ├── hero_images/
│       └── identities/
│
├── runtime/
│   ├── content_index.generated.json  # Indexing
│   └── visual_asset_manifest.json    # Asset registry
│
└── demo/                             # (KEEP for reference, HIDE from UI)
    ├── module_01.json
    ├── exam_asli_01.json
    └── exam_ai_01.json
```

---

## 📋 CUSTOM RESOURCE DATA FORMATS

### **1. Module Content (TEXT)**
```json
{
  "module_id": "neuro_01",
  "domain_id": "neurology",
  "title": "Stroke Pathophysiology",
  "overview": "...",
  "learning_goals": ["Goal 1", "Goal 2"],
  "expanded_sections": [
    {
      "section_id": "s01",
      "heading": "Ischemic Stroke",
      "content_blocks": [
        {"type": "paragraph", "text": "..."},
        {"type": "image_ref", "asset_id": "stroke_01.png"},
        {"type": "list", "items": ["Bullet 1", "Bullet 2"]}
      ]
    }
  ],
  "glossary": [{"term": "...", "meaning": "..."}],
  "key_points": ["Point 1", "Point 2"]
}
```

### **2. Quiz/Exam (TEXT)**
```json
{
  "exam_id": "quiz_neuro_01",
  "domain_id": "neurology",
  "title": "Stroke Assessment",
  "questions": [
    {
      "number": 1,
      "stem": "Question text",
      "options": ["A", "B", "C", "D"],
      "answer_index": 0,
      "explanation": "Why this is correct",
      "confidence": "High-Yield",
      "tags": ["stroke", "acute"]
    }
  ]
}
```

### **3. Visual Asset Metadata (IMAGE)**
```json
{
  "asset_id": "stroke_01.png",
  "type": "anatomy_diagram | clinical_pearl | case_image",
  "title": "Acute Ischemic Stroke MRI",
  "description": "...",
  "file_path": "shared_assets/visual/anatomy/stroke_01.png",
  "domain_tags": ["neurology"],
  "surface_ids": [3, 9, 12],  # Used in these surfaces
  "credits": "Source/Author"
}
```

### **4. 3D Model Metadata (3D)**
```json
{
  "model_id": "brain_01",
  "type": "full_anatomy | region_specific | pathology",
  "title": "Human Brain - Anatomical View",
  "file_path": "shared_assets/3d/anatomy_models/brain_01.glb",
  "interactive_hotspots": [
    {
      "id": "brocas_area",
      "label": "Broca's Area",
      "position": [x, y, z],
      "tooltip": "Speech production region"
    }
  ],
  "surface_ids": [13],
  "credits": "Model source"
}
```

### **5. Glossary Master (TEXT)**
```json
{
  "glossary_id": "neuro_glossary",
  "domain_id": "neurology",
  "terms": [
    {
      "term": "Afasia",
      "meaning": "Gangguan kemampuan bahasa...",
      "usage_context": "Used in Surface 14, Module neurology_01",
      "related_terms": ["Ekspresif", "Reseptif"]
    }
  ]
}
```

---

## 🎯 DOMAIN PLANNING GUIDE

### **How Many Domains Do You Need?**

**Option A: Mono-Domain (Recommended untuk MVP)**
```
1 Primary Domain (e.g., Neurology)
├── 4-6 Modules (one per learning batch)
├── 50-100 Content Assets
├── 30-50 Quiz Questions
└── 20-30 3D Models / Images
```
**Effort**: ~4-8 weeks | **Resources**: Manageable

---

**Option B: Multi-Domain (Enterprise)**
```
3-5 Medical Specialties
├── Neurology
├── Cardiology
├── Orthopedics
├── Pulmonology
└── ...

Per domain: 4-8 modules
Total Assets: 500-1000+
Total Questions: 300-500+
```
**Effort**: ~6-12 months | **Resources**: Team required

---

**Option C: Hybrid (Recommended for Growth)**
```
1 Primary Domain (Deep, Complete)
├── 4-8 modules with full content
├── 100+ visual assets
├── 50+ quiz questions
└── 30+ 3D models

+ 2-3 Secondary Domains (Lite, Curated)
├── 2-3 modules each
├── 20-30 visual assets per domain
├── 15-20 quiz questions per domain
└── Optional 3D models
```
**Effort**: ~8-12 weeks | **Resources**: Feasible for small team

---

## 📝 SUMMARY: RESOURCE CHECKLIST

### **Text/Materi** ✅
- [ ] Module content (overviews, sections, key points)
- [ ] Quiz questions + answers
- [ ] Flashcard pairs
- [ ] Glossary definitions
- [ ] Learning goals & metadata

### **Visual/Image** ✅
- [ ] Anatomy diagrams (20-50 per domain)
- [ ] Clinical illustrations (10-20)
- [ ] Clinical pearls images (10-20)
- [ ] Hero images for dashboard
- [ ] Thumbnail previews (for galleries)

### **3D/Media** ✅
- [ ] Anatomy models (GLTF/GLB format)
- [ ] Interactive hotspots data
- [ ] Pathology variant models
- [ ] MRI/CT reference images

### **Metadata** ✅
- [ ] Domain metadata
- [ ] Module indexing
- [ ] Asset registry
- [ ] Progress tracking schema
- [ ] Search index data

---

## 🔥 NEXT STEPS

1. **Decide**: How many domains? (Mono/Multi/Hybrid?)
2. **Prepare**: Content structure & asset list
3. **Create**: Custom resource JSON schemas
4. **Build**: Batch 1 (Foundation) with real content
5. **Test**: Surfaces render properly with your data
