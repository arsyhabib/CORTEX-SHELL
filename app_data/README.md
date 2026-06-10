# CORTEX-SHELL App Data Structure

This directory contains all domain content, system configuration, and batch metadata for the CORTEX-SHELL learning application.

## Directory Organization

```
app_data/
├── domains/                          # Content domains
│   ├── materi/                       # Learning materials domain
│   │   ├── modules/                  # Module content (organized by module_id)
│   │   │   ├── index.json           # AUTO-GENERATED index of all modules
│   │   │   ├── batch_1_modules.json # Batch 1 module listing
│   │   │   ├── mod_neuro_stroke_001/
│   │   │   │   ├── metadata.json
│   │   │   │   ├── content.md       # Main module content (markdown format)
│   │   │   │   └── sections/        # Individual section files (optional)
│   │   │   └── [future modules]
│   │   └── surface_mapping.json     # Maps module content to surfaces
│   │
│   ├── exam_asli/                   # Original exam domain (Batch 3)
│   │   ├── exam_sets/
│   │   └── index.json
│   │
│   └── bank_soal_ai/                # AI-generated questions domain (Batch 3)
│       ├── question_sets/
│       └── index.json
│
├── system/                           # System-level configuration
│   ├── pages/
│   │   ├── page_0_studio.json       # Main navigation studio (fixed)
│   │   └── page_1_welcome.json      # Welcome/onboarding (configurable)
│   │
│   ├── search/
│   │   └── search_index.json        # AUTO-GENERATED search index
│   │
│   └── settings/
│       └── default_settings.json    # Default user preferences
│
└── batch_metadata/                  # Batch tracking and status
    ├── batch_1_status.json          # Progress tracking for Batch 1
    ├── batch_1_validation.json      # QA checklist for Batch 1
    └── batch_1_timeline.json        # Timeline and milestones

```

## Content Domains Explained

### 1. Materi Domain
**Purpose**: Learning content, educational materials, textbook-style content  
**Target Surfaces**: 2-4 (Foundation), 9-16 (Review/Reference), 22 (QuickRef)  
**Structure**: Modules → Sections → Content Blocks  
**Format**: Markdown (auto-parsed to JSON)  
**Status**: Batch 1 in progress (1 module complete)

### 2. Exam Asli Domain  
**Purpose**: Real/original examination question sets  
**Target Surfaces**: 17 (Quiz), 18 (Flashcard)  
**Structure**: Exam Sets → Questions → Options + Explanations  
**Format**: Markdown (auto-parsed to JSON)  
**Status**: Batch 3 (planned)

### 3. Bank Soal AI Domain
**Purpose**: AI-generated question sets for practice and assessment  
**Target Surfaces**: 17 (Quiz), 18 (Flashcard)  
**Structure**: Question Sets → Questions → Options + Explanations  
**Format**: Markdown (auto-parsed to JSON)  
**Status**: Batch 3 (planned)

## Batch Distribution

### Batch 1: Foundation + Discover ✅ In Progress
- Surfaces: 0, 1, 2, 3, 4, 6, 7
- Content: Module metadata + overview + learning goals
- Modules: 1 complete (mod_neuro_stroke_001), 1 optional (mod_neuro_headache_002)
- Status: Content generation 50% complete, parsing pending

### Batch 2: Review + Reference (Planned)
- Surfaces: 9, 10, 11, 12, 13, 14, 15, 16
- Content: Full module sections with visuals, glossary, callouts
- Modules: 2-3 additional modules
- Timeline: Weeks 3-4

### Batch 3: Practice + Utilities (Planned)
- Surfaces: 17, 18, 19, 22, 23
- Content: Exam questions, flashcards, reference materials
- Modules: Exam sets from exam_asli + bank_soal_ai domains
- Timeline: Weeks 5-6

## Content Generation Workflow

### Phase 1: Content Generation ✅ In Progress
**Input**: Domain knowledge + source materials  
**Tool**: PROMPT_MATERI_REFINED.md (for materi domain)  
**Output**: Module markdown files with Grade 1-4 information hierarchy  
**Status**: 1 module complete (mod_neuro_stroke_001 - 8500 words)

### Phase 2: Content Parsing (Next)
**Input**: Module markdown files  
**Tool**: Node.js parser script (to be created)  
**Output**: JSON structures for each surface  
**Expected**: Complete by 2025-02-11

### Phase 3: Surface Mapping (Next)
**Input**: Parsed JSON content  
**Output**: Surface-specific data structures  
**Surfaces**: 2 (dashboard), 3 (learning), 4 (detail)  
**Expected**: Complete by 2025-02-12

### Phase 4: Search Index Generation (Next)
**Input**: All parsed content  
**Output**: Searchable index with tags, keywords, references  
**Surface**: 6 (search functionality)  
**Expected**: Complete by 2025-02-13

### Phase 5: QA & Validation (Next)
**Input**: All generated content  
**Checklist**: 20-point validation checklist  
**Expected**: Complete by 2025-02-14

## File Naming Conventions

### Module Files
- **Module ID format**: `mod_[domain]_[topic]_[000]`
- **Example**: `mod_neuro_stroke_001`
- **Directory**: `app_data/domains/materi/modules/mod_neuro_stroke_001/`
- **Files**:
  - `metadata.json` - Module metadata, learning goals, section list
  - `content.md` - Full module content in markdown format
  - `sections/` - Individual section markdown files (optional)

### Exam Set Files
- **Exam Set ID format**: `exam_[source]_[year]_[code]`
- **Example**: `exam_original_2025_6e`
- **Question ID format**: `batch[n]_q[00]`
- **Example**: `batch1_q01`, `batch3_q47`

### Search Index
- **File**: `app_data/system/search/search_index.json`
- **AUTO-GENERATED** after each content parsing phase
- **Contains**: All searchable items (modules, sections, glossary terms, questions)

## JSON Schema Examples

### Module Metadata Structure
```json
{
  "module_id": "mod_neuro_stroke_001",
  "title": "Acute Ischemic Stroke",
  "domain": "neuro_emergency",
  "batch_id": "batch_1",
  "sections": [
    {
      "section_id": "s01",
      "title": "Epidemiology & Global Burden",
      "order": 1,
      "estimated_time_minutes": 15
    }
  ],
  "learning_goals": ["Goal 1", "Goal 2"],
  "status": "finalized"
}
```

### Surface 2 (Dashboard) Data Structure
```json
{
  "hero_title": "Neurologi Klinis",
  "hero_subtitle": "Stroke, Headache, Neuroemergency",
  "featured_modules": [
    {
      "module_id": "mod_neuro_stroke_001",
      "title": "Acute Ischemic Stroke",
      "progress": 0,
      "estimated_time": "3.5 hours"
    }
  ],
  "stats": {
    "modules_total": 1,
    "modules_completed": 0
  }
}
```

### Surface 3 (Learning Surface) Data Structure
```json
{
  "module_id": "mod_neuro_stroke_001",
  "module_title": "Acute Ischemic Stroke",
  "overview": "...",
  "learning_goals": ["Goal 1", "Goal 2"],
  "sections": [
    {
      "section_id": "s01",
      "heading": "Epidemiology & Global Burden",
      "order": 1
    }
  ]
}
```

## Important Notes

### AUTO-GENERATED Files
These files are created automatically by scripts and should NOT be manually edited:
- `app_data/domains/materi/modules/index.json`
- `app_data/system/search/search_index.json`

If these files become corrupted:
1. Delete the file
2. Run the index generation script
3. Regenerate by processing domain content

### Markdown to JSON Parsing
Module content is written in **markdown** format following PROMPT_MATERI_REFINED structure:
- Module metadata section at top
- Structured section headings (s01, s02, etc.)
- Content marked with special notation:
  - **📖 Content Paragraphs** for prose
  - **📋 Bullets** for structured lists
  - **💡 Callouts** for clinical pearls/warnings
- Markdown is automatically parsed into JSON for app consumption

### Content Versioning
- Each module has a version field in metadata.json
- Current version: 1.0 (Batch 1)
- Updates increment minor version: 1.1, 1.2, etc.
- Breaking changes increment major version: 2.0

## Development Workflow

### Adding New Module to Batch 1
1. Create directory: `app_data/domains/materi/modules/mod_[domain]_[topic]_[000]/`
2. Use PROMPT_MATERI_REFINED.md to generate content.md
3. Create metadata.json with module information
4. Add module reference to `batch_1_modules.json`
5. Update `batch_1_status.json` with new module details
6. Run parsing script to generate Surface-specific JSON
7. Validate in QA checklist

### Adding New Exam Set to Batch 3
1. Create directory: `app_data/domains/exam_asli/exam_sets/exam_[code]/`
2. Use PROMPT_SOAL_REFINED.md to generate questions.md
3. Create metadata.json with exam set information
4. Run parsing script to generate Surface 17/18 JSON
5. Validate questions and flashcards

## Status & Next Steps

### ✅ Completed (Batch 1)
- [x] Directory structure created
- [x] BATCH_1_IMPLEMENTATION_SPEC.md finalized
- [x] First module (mod_neuro_stroke_001) generated (8,500 words)
- [x] Module metadata.json created
- [x] Batch tracking files created

### ⏳ In Progress
- [ ] Phase 2: Parse markdown to JSON (target 2025-02-11)
- [ ] Phase 3: Map content to Surfaces 2-4 (target 2025-02-12)
- [ ] Phase 4: Generate search index (target 2025-02-13)
- [ ] Phase 5: QA & Validation (target 2025-02-14)

### 📋 Planned (Batch 2 & 3)
- [ ] Generate additional modules for Batch 1 (optional mod_neuro_headache_002)
- [ ] Create Batch 2 content (Surfaces 9-16)
- [ ] Create Batch 3 content (Surfaces 17-23)
- [ ] Test content index generation with real data
- [ ] Finalize Batch 4 (master customization schema)

## Contact & Support

For questions about:
- **Content structure**: See CONTENT_SCHEMA_MASTER.md
- **Content generation**: See PROMPT_MATERI_REFINED.md and PROMPT_SOAL_REFINED.md
- **Implementation**: See BATCH_1_IMPLEMENTATION_SPEC.md
- **Status tracking**: See batch_metadata/batch_1_status.json

---

**Last Updated**: 2025-02-09  
**Batch 1 Status**: In Progress (50% complete)  
**Next Review**: 2025-02-11
