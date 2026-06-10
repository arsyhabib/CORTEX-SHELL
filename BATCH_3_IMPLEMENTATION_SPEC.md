# BATCH 3 IMPLEMENTATION SPEC
## Complete Surface Schema, Agent Work Guide Packages & System Config

**Status**: ✅ Complete  
**Branch**: `claude/html-pages-customization-map-aqeome`  
**PR**: #2  

---

## Overview

Batch 3 accomplishes three parallel objectives:
1. **Complete surface wiring** — All remaining hardcoded surfaces (S3, S4, S6, S18, S22, S23) refactored to read from dynamic data sources
2. **System configuration layer** — app_config.json, search index schema, welcome page config
3. **Agent Work Guide packages** — Permanent reusable anchor files for AI agents processing raw PDF resources

After Batch 3, every surface in the application is mapped, schemaed, and ready for content injection.

---

## Part A: Surface Wiring Completions

### Complete Surface Status After Batch 3

| Surface | Component | Data Source | Batch | Status |
|---------|-----------|-------------|-------|--------|
| S2 | PageHome | contentIndex | B1 | ✅ Dynamic |
| S3 | PageLearning | **lectureModule** | **B3** | ✅ **Refactored** |
| S4 | PageSlideDetail | **lectureModule/Meta** | **B3** | ✅ **Refactored** |
| S6 | PageSearch | **contentIndex** | **B3** | ✅ **Refactored** |
| S7 | PageSettings | theme props | B1 | ✅ Dynamic |
| S9 | PageTypographyReading | lectureModule | B2 | ✅ Dynamic |
| S10 | PageBulletContent | lectureModule | B2 | ✅ Dynamic |
| S11 | PageCalloutClinicalPearl | lectureModule | B2 | ✅ Dynamic |
| S12 | PageImageCard | visualManifest | B2 | ✅ Dynamic |
| S13 | PageMediaViewer3D | visualManifest | B2 | ✅ Dynamic |
| S14 | PageGlossaryTerms | lectureModule | B2 | ✅ Dynamic |
| S15 | PageQuickSummary | lectureModule | B2 | ✅ Dynamic |
| S16 | PageBilingualSimple | lectureModule | B2 | ✅ Dynamic |
| S17 | PageQuiz | examSet | B1 | ✅ Dynamic |
| S18 | PageFlashcard | **lectureModule + examSet** | **B3** | ✅ **Enhanced** |
| S19 | PageProgressDashboard | contentIndex + visualManifest | B2 | ✅ Dynamic |
| S22 | PageQuickRefModal | **lectureModule** | **B3** | ✅ **Refactored** |
| S23 | PageHelpAboutPrivacy | **appConfig** | **B3** | ✅ **Refactored** |

---

### Surface 3 — PageLearning (Slide Viewer)

**Previous state**: Fully hardcoded 3 slides with hardcoded anatomy content.

**Changes made** (`index.html`):
- New prop signature: `{ onNavigate, lectureModule, lectureModuleMeta }`
- `moduleSections` useMemo: maps `module.sections[]` to slide objects with `title`, `sub`, `content`, `callout`, `keyTerms`
- `hasDynamic` flag: enables/disables fallback
- `FALLBACK_SLIDES`: 3 fallback slides for when no module is loaded
- Slide card renders `s.title`, `s.sub`, `s.content` (paragraph split on `\n\n`), `s.callout` with tone-aware colors, `s.keyTerms` humanized via `cortexHumanizeTerm`
- `CALLOUT_TONE_COLORS` map: `pearl→green`, `evidence→teal`, `note→info`, `caution→gold`, `danger/warning→red`
- Module title truncated to 22 chars in topbar
- Resets to slide 0 on module change via `useEffect`

**Schema consumed**:
```json
{
  "sections": [{
    "id": "s01", "title": "Section Title",
    "summary": "Short description shown under title",
    "content": [{ "text": "Paragraph text..." }],
    "callouts": [{ "tone": "clinical_pearl", "title": "Pearl title", "text": "Body", "icon": "💡" }],
    "glossary_refs": ["term_id_1", "term_id_2"]
  }]
}
```

---

### Surface 4 — PageSlideDetail (Module Overview / Chapter List)

**Previous state**: Fully hardcoded 14 anatomy chapters with hardcoded instructor and stats.

**Changes made**:
- New prop signature: `{ onNavigate, lectureModule, lectureModuleMeta }`
- `dynamicChapters` useMemo: maps sections to chapter objects `{ id, t, dur, done, current }`
- Uses `section.estimated_time_minutes` for duration; falls back to "20 min"
- `heroTitle` from `lectureModule.title` or `lectureModuleMeta.title`
- `heroSub` derived: `${sections.length} sections • ${wordCount/180} min read • ${domain}`
- Stats row: reads `wordCount`, `sectionCount` dynamically; progress always 0% for fresh modules
- Section list header switches "Chapters" → "Sections" when dynamic

**Schema consumed**:
```json
{
  "title": "Module Title",
  "domain": "neuro_emergency",
  "wordCount": 8500,
  "sections": [{ "id": "s01", "title": "Section 1", "estimated_time_minutes": 15 }]
}
```

---

### Surface 6 — PageSearch

**Previous state**: 7 hardcoded results, hardcoded recents/trending arrays.

**Changes made**:
- New prop signature: `{ onNavigate, contentIndex, onSelectLecture, onSelectExamSet }`
- `dynamicResults` useMemo: iterates `contentIndex.lectureDomains[].modules[]` + `contentIndex.examSets[]`
- Domain icon mapping: `neuro→🧠`, `cardio→🫀`, `pharmaco→💊`, `anatomy→🧬`, default `📖`
- Each result has `action` callback: modules → `onSelectLecture(id) + navigate(3)`, exam sets → `onSelectExamSet(id) + navigate(17)`
- `renderSearchContent()` updated to use `r.action || default navigate(3)` per result
- `recents` from `localStorage.cortex.recentSearches` (JSON array) with fallback
- `trending` from module `topicTags[]` across all domains; falls back to hardcoded
- Graceful fallback: uses `FALLBACK_RESULTS` (7 hardcoded) when `contentIndex` is null

---

### Surface 18 — PageFlashcard (Enhanced)

**Previous state**: Shows only 1 card (first glossary term); no navigation between cards; no exam support.

**Changes made**:
- New prop signature: `{ onNavigate, lectureModule, examSet }`
- `glossaryCards` useMemo: `cortexGetLectureGlossary(lectureModule, 20)` → cards with `front: "Apa itu X?"`, `back: term.def`
- `examCards` useMemo: `cortexGetExamQuestions(examSet)` → cards with question stem as front, `"A. answer\n\nexplanation"` as back
- Deck mode switcher (B2Segmented): `'glossary' | 'exam'`
- `cardIdx` state + `handleNext`/`handlePrev` with 120ms flip-reset animation
- Shows `card X / N` position indicator
- Resets on mode/module/exam change via useEffect
- Three metric cards: Mode, Total cards, Current position
- Falls back to `FALLBACK_CARD` when no content loaded

---

### Surface 22 — PageQuickRefModal

**Previous state**: Hardcoded title "Neuro Check Mini Guide" + 4 hardcoded "Speech clarity" etc. items.

**Changes made**:
- New prop signature: `{ onNavigate, lectureModule }`
- `dynamicItems` useMemo: extracts callouts with pearl/evidence/caution/danger tones from ALL sections
- Max 10 items; preserves `section` label for context
- `refTitle` derives from `lectureModule.title` (truncated to 28 chars)
- Modal header shows "QuickRef — Dynamic" kicker when content loaded
- Bullet list uses `item.text` + `item.sub` (full callout body as sub-text)
- Falls back to 4 hardcoded items when no module loaded

---

### Surface 23 — PageHelpAboutPrivacy

**Previous state**: Hardcoded English text for Help/About/Privacy sections.

**Changes made**:
- New prop signature: `{ onNavigate, appConfig }`  
- `const cfg = appConfig || {}`
- `text.help` from `cfg.help.text`, `text.about` from `cfg.about.text`, `text.privacy` from `cfg.privacy.text`
- Support row items: reads `cfg.help.support_contact`, `cfg.about.version_label`, `cfg.help.data_handling`
- All text in Bahasa Indonesia when loaded from config
- Graceful fallback to hardcoded Indonesian defaults

---

## Part B: New System Configuration Files

### `app_data/system/config/app_config.json`

Loaded at startup via `cortexFetchJSONCandidates([CORTEX_RUNTIME_APP_CONFIG_PATH])`. Available in all surface components via `sharedProps.appConfig`.

**Sections**:
- `app.*` — Name, subtitle, institution, locale, version
- `welcome.*` — Welcome screen text + CTA
- `home.*` — Greeting template, section titles, quick action buttons
- `help.*` / `about.*` / `privacy.*` — Text for Surface 23
- `search.*` — Placeholder text, fallback recents/trending
- `settings.*` — UI label strings
- `progress.*` — Metric label strings for Surface 19

### `app_data/system/search/search_index.json`

Schema reference for the auto-generated search index. Contains `_schema_reference` with full entry schema + examples for all 6 entry types. The `entries[]` array is empty and populated by the search index generator script (future).

**Entry types**: `module`, `section`, `glossary`, `exam_set`, `question`, `visual`

### `app_data/system/pages/page_1_welcome.json`

Configuration for the welcome/onboarding animation screen. Covers text content and animation timing parameters.

---

## Part C: Agent Work Guide Packages

All package files are in `/home/user/CORTEX-SHELL/packages/`.

### Structure

```
packages/
├── materi/
│   ├── PROMPT_MATERI_VISION_AGENT.md       ← Main prompt for lecture PDF processing
│   ├── SCHEMA_MODULE_JSON_REFERENCE.md      ← Complete module.json schema reference
│   ├── VISUAL_MAPPING_GUIDE.md              ← Visual asset naming & cataloging
│   ├── BATCH_PROCESSING_GUIDE.md            ← Multi-batch workflow (max 10 PDFs/batch)
│   ├── CONTENT_RATIO_PROTOCOL.md            ← 60% source / 40% AI research protocol
│   ├── OCR_VISION_PROTOCOL.md               ← OCR + Vision processing guidelines
│   └── OUTPUT_VALIDATION_CHECKLIST.md       ← QA checklist for module.json output
│
├── soal/
│   ├── PROMPT_SOAL_VISION_AGENT.md          ← Main prompt for exam PDF processing
│   ├── SCHEMA_EXAM_JSON_REFERENCE.md        ← Complete exam_set.json schema reference
│   ├── BATCH_PROCESSING_GUIDE.md            ← Multi-batch workflow (max 3 PDFs/batch)
│   ├── OCR_VISION_PROTOCOL.md               ← OCR + Vision processing guidelines
│   └── OUTPUT_VALIDATION_CHECKLIST.md       ← QA checklist for exam JSON output
│
└── shared/
    ├── CONTENT_INDEX_REGISTRY_GUIDE.md      ← How to register new modules/exam sets
    ├── VISUAL_ASSET_MANIFEST_GUIDE.md       ← Visual manifest update procedure
    ├── COMPILE_AUDIT_GUIDE.md               ← Multi-batch compilation & auditing
    └── APP_INTEGRATION_CHECKLIST.md         ← Final checklist before app deployment
```

### Package 1 — MATERI (Lecture PDF → module.json)

**Input**: Raw lecture PDF slides (up to 10 PDFs per batch)  
**Output**: One `module.json` per batch, following the exact surface schema  
**Content ratio**: 60% source-faithful + 40% AI-researched complementary  
**Special handling**: Image-only PDFs (full vision), handwritten annotations, embedded diagrams

**Key prompt phases**:
1. EXTRACTION — Per-PDF systematic OCR + Vision analysis
2. ENRICHMENT — Adding 40% AI research content
3. STRUCTURING — Mapping to module.json schema
4. VISUAL MAPPING — Cataloging all images as visual asset entries
5. VALIDATION — Self-check before output

### Package 2 — SOAL (Exam PDF → exam_set.json)

**Input**: Raw exam PDF sets (up to 3 PDFs per batch)  
**Output**: One `exam_set.json` per batch  
**Types**: `exam_asli` (real university exams) | `bank_soal_ai` (AI-generated questions)  
**Special handling**: Scanned exam sheets, answer keys on separate pages, image-based questions

**Key prompt phases**:
1. EXTRACTION — Question + answer + explanation extraction
2. RECONSTRUCTION — Rebuilding corrupted/partial questions
3. CLASSIFICATION — Confidence category assignment
4. VALIDATION — Answer consistency check

### Batch 4 Plan (Ready to Execute)

Batch 4 will compile all packages into 2 ZIP files:

**ZIP 1 — MATERI DOMAIN ANCHOR PACKAGE**:
- packages/materi/* (7 files)
- packages/shared/* (4 files)
- app_data/domains/materi/modules/mod_neuro_stroke_001/ (example module)
- app_data/runtime/content_index.kimi.json (registry reference)
- app_data/runtime/visual_asset_manifest.generated.json (manifest reference)
- CONTENT_SCHEMA_MASTER.md (surface-to-schema reference)

**ZIP 2 — SOAL DOMAIN ANCHOR PACKAGE**:
- packages/soal/* (5 files)
- packages/shared/* (4 files)
- app_data/demo/exam_asli_01.json (example asli)
- app_data/demo/exam_ai_01.json (example AI)
- app_data/runtime/content_index.kimi.json (registry reference)

---

## Data Flow: Complete Picture After Batch 3

```
app_data/runtime/content_index.kimi.json
  ├── lectureDomains[]
  │   └── modules[] → sourceFile → module.json
  │       ├── sections[].content[]      → S3 (Learning slides)
  │       ├── sections[]                → S4 (Section list)
  │       ├── sections[].content[]      → S9 (Typography Reading)
  │       ├── sections[].bullets[]      → S10 (Bullet Content)
  │       ├── sections[].callouts[]     → S11 (Clinical Pearl)
  │       ├── sections[].visual_refs[]  → S12 (Image Cards) *via manifest
  │       ├── sections[].glossary_refs[] → S14 (Glossary Terms)
  │       ├── summary[] + exam_focus[]  → S15 (Quick Summary)
  │       ├── bilingual[] + sections[].bilingual → S16 (Bilingual Simple)
  │       ├── glossary[]                → S18 (Flashcard, glossary mode)
  │       └── sections[].callouts[]     → S22 (QuickRef Modal)
  └── examSets[] → sourceFile → exam_set.json
      ├── questions[]                   → S17 (Quiz)
      └── questions[]                   → S18 (Flashcard, exam mode)

app_data/runtime/visual_asset_manifest.generated.json
  └── assets[]                         → S12 (Image Cards)
                                       → S13 (Media Viewer 3D)
                                       → S19 (Progress: visual count)

app_data/system/config/app_config.json
  └── help/about/privacy text          → S23 (Help About Privacy)
  └── home.quick_actions               → S2 (Home Dashboard)
  └── search.fallback_*               → S6 (Search)

(All via sharedProps) → S6, S7, S17, S18, S19 via contentIndex
```

---

## Files Changed (Batch 3)

| File | Change Type | Description |
|------|------------|-------------|
| `index.html` | Modified | S3, S4, S6, S18, S22, S23 refactored; appConfig state added; renderSearchContent updated; S19 3D count fixed |
| `app_data/system/config/app_config.json` | Created | App-level configuration for all surfaces |
| `app_data/system/search/search_index.json` | Created | Search index schema template (entries[] empty, populated by generator) |
| `app_data/system/pages/page_1_welcome.json` | Created | Welcome page text and animation config |
| `packages/materi/PROMPT_MATERI_VISION_AGENT.md` | Created | Main OCR+Vision agent prompt for lecture PDFs |
| `packages/materi/SCHEMA_MODULE_JSON_REFERENCE.md` | Created | Complete module.json schema documentation |
| `packages/materi/VISUAL_MAPPING_GUIDE.md` | Created | Visual asset naming and cataloging guide |
| `packages/materi/BATCH_PROCESSING_GUIDE.md` | Created | Multi-batch workflow for 60 PDFs |
| `packages/materi/CONTENT_RATIO_PROTOCOL.md` | Created | 60/40 source/AI content protocol |
| `packages/materi/OCR_VISION_PROTOCOL.md` | Created | OCR + Vision processing guidelines |
| `packages/materi/OUTPUT_VALIDATION_CHECKLIST.md` | Created | QA checklist for module.json |
| `packages/soal/PROMPT_SOAL_VISION_AGENT.md` | Created | Main OCR+Vision agent prompt for exam PDFs |
| `packages/soal/SCHEMA_EXAM_JSON_REFERENCE.md` | Created | Complete exam_set.json schema documentation |
| `packages/soal/BATCH_PROCESSING_GUIDE.md` | Created | Multi-batch workflow for exam sets |
| `packages/soal/OCR_VISION_PROTOCOL.md` | Created | OCR + Vision guidelines (exam context) |
| `packages/soal/OUTPUT_VALIDATION_CHECKLIST.md` | Created | QA checklist for exam JSON |
| `packages/shared/CONTENT_INDEX_REGISTRY_GUIDE.md` | Created | Content registry update procedures |
| `packages/shared/VISUAL_ASSET_MANIFEST_GUIDE.md` | Created | Visual manifest update guide |
| `packages/shared/COMPILE_AUDIT_GUIDE.md` | Created | Multi-batch compilation and auditing |
| `packages/shared/APP_INTEGRATION_CHECKLIST.md` | Created | Final integration checklist |

---

**Last Updated**: 2026-06-10  
**Branch**: `claude/html-pages-customization-map-aqeome`  
**PR**: https://github.com/arsyhabib/CORTEX-SHELL/pull/2
