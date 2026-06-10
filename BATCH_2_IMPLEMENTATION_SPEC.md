# BATCH 2 IMPLEMENTATION SPEC
## Surfaces 9–16: Review & Reference Content Layer

**Status**: ✅ Complete  
**Branch**: `claude/html-pages-customization-map-aqeome`  
**Commit**: `a8cf182`  
**PR**: #2  

---

## Overview

Batch 2 wires all 8 Review/Reference surfaces (9–16) to the module JSON data layer. Three surfaces were discovered to be fully hardcoded and were refactored. The first production module (`mod_neuro_stroke_001`) was created with complete data for all 8 surfaces.

---

## Surface-by-Surface Audit

### Surface 9 — Typography Reading (`PageTypographyReading`)
**Status**: Already dynamic (no refactor needed)  
**Data Source**: `lectureModule.sections[].content[]` via `cortexGetLectureSections()`  
**New Content**: `mod_neuro_stroke_001` provides 11 sections × 3–5 content paragraphs each  

**Schema consumed**:
```json
{
  "sections": [{
    "id": "s01",
    "title": "Epidemiology & Global Burden",
    "content": [
      { "text": "Paragraph content here..." }
    ]
  }],
  "topicTags": ["Stroke", "Neuroemergency"]
}
```

---

### Surface 10 — Bullet Content (`PageBulletContent`)
**Status**: ✅ Refactored — was 100% hardcoded  
**Data Source**: `lectureModule.sections[].bullets[]` (new additive field)  
**Changes made to `index.html`**:
- Added `moduleSections` useMemo extracting sections with non-empty bullets arrays
- Added `hasDynamicContent` boolean flag to toggle between dynamic and fallback
- Added section tab navigator (horizontal scrollable chip row) for multi-section browsing
- Hero title now derives from `activeSectionTitle` or module title
- `FALLBACK_BULLETS` array (4 items) used when no module loaded

**Schema consumed**:
```json
{
  "sections": [{
    "bullets": [
      {
        "text": "Main bullet point text",
        "sub": ["Sub-bullet 1", "Sub-bullet 2"],
        "tone": "default"
      }
    ]
  }]
}
```

**Bullet tone values**: `default`, `pearl`, `evidence`, `caution`, `danger`, `note`

---

### Surface 11 — Clinical Pearl (`PageCalloutClinicalPearl`)
**Status**: ✅ Refactored — was 100% hardcoded  
**Data Source**: `lectureModule.sections[].callouts[]` (new additive field)  
**Changes made to `index.html`**:
- Added `TONE_MAP` for raw tone normalization to display tones
- Added `dynamicCallouts` useMemo extracting all callouts across all sections, with `sectionRef` added
- Filter bar works on normalized tones only
- Section separator labels between callout groups
- `FALLBACK_CALLOUTS` array (4 items) used when no module loaded

**TONE_MAP normalization**:
```javascript
const TONE_MAP = {
  pearl: 'pearl',
  clinical_pearl: 'pearl',
  exam_pearl: 'evidence',
  teaching_point: 'note',
  warning: 'danger',
  caution: 'caution',
  evidence: 'evidence',
  note: 'note',
  medication: 'pearl',
  radiology_pearl: 'evidence',
  danger: 'danger'
};
```

**Schema consumed**:
```json
{
  "sections": [{
    "callouts": [
      {
        "tone": "clinical_pearl",
        "title": "Callout title",
        "text": "Callout body content",
        "icon": "🔬"
      }
    ]
  }]
}
```

---

### Surface 12 — Image Cards (`PageImageCard`)
**Status**: Already dynamic — reads from `visualManifest` prop  
**Data Source**: `app_data/runtime/visual_asset_manifest.generated.json`  
**New Content**: Populated with 27 visual assets for `mod_neuro_stroke_001`  
**Resolver**: `cortexResolveVisualAssets(visualManifest)` — reads `manifest.assets[]`

**Visual asset schema**:
```json
{
  "assets": [{
    "id": "visual_stroke_epidemiology_01",
    "type": "infographic",
    "title": "Global Stroke Epidemiology",
    "subtitle": "Insiden stroke global dan distribusi regional",
    "moduleId": "mod_neuro_stroke_001",
    "sectionId": "s01",
    "sectionTitle": "Epidemiology & Global Burden",
    "alt": "Infographic showing global stroke incidence per 100,000...",
    "tags": ["epidemiology", "global burden"],
    "status": "placeholder",
    "placeholderColor": "#3B82F6",
    "placeholderIcon": "📊"
  }]
}
```

**Visual distribution across sections**:
| Section | Visual Count | Types |
|---------|-------------|-------|
| s01 | 2 | infographic, chart |
| s02 | 3 | diagram, diagram_3d, timeline |
| s03 | 2 | reference_card, anatomy |
| s04 | 2 | flowchart, comparison |
| s05 | 4 | radiology ×4 |
| s06 | 2 | protocol, timeline |
| s07 | 3 | diagram, reference_card ×2 |
| s08 | 3 | equipment, procedure, reference_card |
| s09 | 2 | diagram, procedure |
| s10 | 2 | timeline, algorithm |
| s11 | 2 | radiology ×2 |

---

### Surface 13 — Media Viewer 3D (`PageMediaViewer3D`)
**Status**: Already dynamic — reads from `visualManifest` + selected visual  
**Data Source**: `app_data/runtime/visual_asset_manifest.generated.json`  
**Notes**: `visual_penumbra_core_01` and `visual_stroke_territories_01` are tagged as `diagram_3d`/`anatomy` types — will surface prominently in 3D viewer context

---

### Surface 14 — Glossary Terms (`PageGlossaryTerms`)
**Status**: Already dynamic — reads from `lectureModule` via `cortexGetLectureGlossary()`  
**New Content**: 15 terms with full bilingual definitions in `mod_neuro_stroke_001`  
**Important**: `cortexGetLectureGlossary()` derives terms from `sections[].glossary_refs[]` (term ID lookups), NOT from `module.glossary[]` directly. The module-level `glossary[]` is used by the tooltip system (`selectedLecture.glossary`).

**Schema**:
```json
{
  "glossary": [
    {
      "term": "Penumbra",
      "term_id": "penumbra",
      "definition": "Zone of ischemic brain tissue surrounding the infarct core...",
      "definition_id": "Zona jaringan otak iskemik yang mengelilingi core infark...",
      "category": "pathophysiology"
    }
  ],
  "sections": [{
    "glossary_refs": ["penumbra", "ischemic_core", "cbf"]
  }]
}
```

**15 glossary terms**: penumbra, ischemic_core, tpa_alteplase, mechanical_thrombectomy, lvo, nihss, aspects_score, dwi, adc_map, cta, perfusion_mismatch, tici_score, hemorrhagic_transformation, collateral_circulation, time_is_brain

---

### Surface 15 — Quick Summary (`PageQuickSummary`)
**Status**: Already dynamic — reads from `lectureModule` via `cortexGetLectureSummary()`  
**New Content**: 6 key takeaways + 8 exam_focus points in `mod_neuro_stroke_001`

**Schema**:
```json
{
  "summary": [
    {
      "id": "key_1",
      "text": "Time is Brain: Every minute ~1.9 million neurons die during stroke..."
    }
  ],
  "exam_focus": [
    {
      "id": "exam_1",
      "text": "DAWN/DEFUSE-3 trial: extended MT window to 24h using perfusion mismatch..."
    }
  ]
}
```

---

### Surface 16 — Bilingual Simple (`PageBilingualSimple`)
**Status**: ✅ Refactored — was 100% hardcoded  
**Data Source**: `lectureModule.bilingual[]` (module-level) or `sections[].bilingual` (section-level fallback)  
**Changes made to `index.html`**:
- Added `moduleBilinguals` useMemo with priority: module.bilingual[] > sections[].bilingual
- Multi-concept navigator (chip row) for browsing 3+ concepts
- Three display modes: `simple` (Bahasa sederhana), `bilingual` (id + en side-by-side), `medical` (terminologi medis lengkap)
- `FALLBACK_BILINGUAL` object used when no module loaded

**Schema (module-level bilingual array)**:
```json
{
  "bilingual": [
    {
      "concept": "Stroke Iskemik / Ischemic Stroke",
      "simple_id": "Stroke iskemik terjadi ketika pembuluh darah otak tersumbat...",
      "simple_id_note": "Catatan untuk pembaca umum",
      "bilingual_id": "Pada stroke iskemik, terjadi oklusi pembuluh darah serebral...",
      "bilingual_en": "In ischemic stroke, occlusion of a cerebral blood vessel...",
      "medical_id": "Stroke iskemik didefinisikan sebagai infark serebral...",
      "medical_note": "Referensi: AHA/ASA 2019 Guidelines"
    }
  ]
}
```

**Schema (section-level bilingual object)**:
```json
{
  "sections": [{
    "bilingual": {
      "simple_id": "...",
      "bilingual_id": "...",
      "bilingual_en": "...",
      "medical_id": "..."
    }
  }]
}
```

---

## Content Registry Updates

### `content_index.kimi.json`

Added `neuro_emergency` domain as primary active domain:

```json
{
  "id": "neuro_emergency",
  "title": "Neurologi Klinis — Stroke & Neuroemergency",
  "moduleCount": 1,
  "modules": [{
    "id": "mod_neuro_stroke_001",
    "title": "Acute Ischemic Stroke: Pathophysiology, Diagnosis & Management",
    "sourceFile": "app_data/domains/materi/modules/mod_neuro_stroke_001/module.json",
    "topicTags": ["Stroke", "Neuroemergency", "Thrombolysis", "Thrombectomy"],
    "status": "active",
    "domainId": "neuro_emergency",
    "batchId": "batch_1",
    "sectionCount": 11,
    "wordCount": 8500
  }]
}
```

---

## Module JSON Stats

**File**: `app_data/domains/materi/modules/mod_neuro_stroke_001/module.json`

| Metric | Count |
|--------|-------|
| Sections | 11 (s01–s11) |
| Content paragraphs | ~44 (avg 4/section) |
| Bullet items | ~88 (avg 8/section) |
| Callout items | ~44 (avg 4/section) |
| Glossary terms | 15 |
| Summary key points | 6 |
| Exam focus points | 8 |
| Bilingual concepts | 3 (module-level) |
| Visual asset refs | 27 |
| Topic tags | 4 |

---

## Files Changed (Batch 2)

| File | Change Type | Description |
|------|------------|-------------|
| `index.html` | Modified | Refactored S10, S11, S16 to dynamic content |
| `app_data/domains/materi/modules/mod_neuro_stroke_001/module.json` | Created | Full module JSON for all 8 surfaces |
| `app_data/runtime/content_index.kimi.json` | Modified | Registered neuro_emergency domain + module |
| `app_data/runtime/visual_asset_manifest.generated.json` | Modified | 27 visual asset entries for module |

---

## Next Steps (Batch 3)

Batch 3 targets Surfaces 17–23: Practice + Utilities

| Surface | Component | Content Domain |
|---------|-----------|---------------|
| S17 | Quiz Engine | `exam_asli` + `bank_soal_ai` |
| S18 | Flashcard | `bank_soal_ai` |
| S19 | Progress Dashboard | Auto-generated from user state |
| S22 | Quick Reference | `materi` (condensed) |
| S23 | Help / Onboarding | `system` domain |

**Exam JSON schema** will need:
- `questions[]` with `stem`, `options[]`, `correct_index`, `explanation`, `topic_tags[]`
- `flashcards[]` with `front`, `back`, `mnemonic`, `topic_tags[]`
- Domain grouping: `exam_asli` (real exams) vs `bank_soal_ai` (AI-generated)

---

**Last Updated**: 2026-06-10  
**Branch**: `claude/html-pages-customization-map-aqeome`  
**PR**: https://github.com/arsyhabib/CORTEX-SHELL/pull/2
