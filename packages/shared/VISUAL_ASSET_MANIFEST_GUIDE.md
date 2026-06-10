# VISUAL ASSET MANIFEST GUIDE — visual_asset_manifest.generated.json
**Version:** 2.0  
**Package:** packages/shared  
**File managed:** app_data/runtime/visual_asset_manifest.generated.json

---

## OVERVIEW

`visual_asset_manifest.generated.json` is the registry for all visual assets used in CORTEX-SHELL content surfaces. It is consumed by:

- **Surface 12 (PageImageCard)** — renders visual assets as annotated image cards within module sections
- **Surface 13 (MediaViewer3D)** — renders 3D models and interactive diagrams

Every visual that a module references must have an entry in this manifest. An asset exists in the manifest before its actual image file is available — the manifest supports placeholder states that allow the app to render gracefully while the real asset is being produced.

The file lives at:
```
app_data/runtime/visual_asset_manifest.generated.json
```

---

## FILE STRUCTURE OVERVIEW

```json
{
  "generatedAt": "2026-06-10",
  "moduleId": "mod_neuro_stroke_001",
  "totalAssets": 27,
  "note": "...",
  "assets": [...]
}
```

### Top-Level Fields

| Field | Type | Description |
|---|---|---|
| `generatedAt` | string | ISO date of last update. Update whenever assets are added or modified. |
| `moduleId` | string | The primary module this manifest was generated for. Note: a single manifest file may grow to cover multiple modules as the app scales. |
| `totalAssets` | integer | Count of entries in the `assets[]` array. Must equal `assets[].length`. |
| `note` | string | Free-text note about the manifest scope or status. |
| `assets` | array | List of asset objects. See asset schema below. |

---

## ASSET ID NAMING CONVENTION

Asset IDs must follow this exact pattern:

```
visual_[module_short]_[descriptor]_[number]
```

Components:
- `visual_` — fixed prefix, always present
- `[module_short]` — abbreviated module identifier (e.g., `stroke`, `cardio`, `neuro`, `pharma`)
- `[descriptor]` — 2–4 word description of the asset content, connected with underscores, all lowercase (e.g., `epidemiology_chart`, `ischemic_cascade`, `tpa_mechanism`)
- `[number]` — zero-padded 2-digit sequence number (`01`, `02`, etc.) — starts at `01` for each new descriptor

Examples from the existing manifest:
- `visual_stroke_epidemiology_01`
- `visual_ischemic_cascade_01`
- `visual_NIHSS_assessment_01`
- `visual_tPA_mechanism_01`
- `visual_DWI_ADC_interpretation_01`

Rules:
- IDs must be globally unique across the entire manifest
- No two assets may share the same ID
- If a new asset is similar to an existing one, increment the number (e.g., `visual_stroke_epidemiology_02`)
- Mixed case is allowed in the descriptor when the term has a standard abbreviation (e.g., `NIHSS`, `tPA`, `DWI`, `CT`)

---

## ASSET OBJECT SCHEMA

### Minimal Valid Asset Entry

```json
{
  "id": "visual_stroke_epidemiology_01",
  "type": "infographic",
  "title": "Global Stroke Epidemiology",
  "subtitle": "Insiden stroke global dan distribusi regional",
  "moduleId": "mod_neuro_stroke_001",
  "sectionId": "s01",
  "sectionTitle": "Epidemiology & Global Burden",
  "alt": "Infographic showing global stroke incidence per 100,000 population with regional comparisons",
  "tags": ["epidemiology", "global burden", "incidence", "statistics"],
  "status": "placeholder",
  "placeholderColor": "#3B82F6",
  "placeholderIcon": "📊"
}
```

### Full Asset Object (all fields)

```json
{
  "id": "visual_stroke_territories_01",
  "type": "anatomy",
  "title": "Cerebral Vascular Territories",
  "subtitle": "Peta teritorial vaskular serebral",
  "moduleId": "mod_neuro_stroke_001",
  "sectionId": "s03",
  "sectionTitle": "Clinical Presentation & Assessment",
  "alt": "Brain anatomy diagram showing MCA, ACA, PCA, vertebrobasilar territories with corresponding clinical syndromes",
  "tags": ["vascular territories", "MCA", "ACA", "PCA", "anatomy", "syndromes"],
  "status": "placeholder",
  "placeholderColor": "#EC4899",
  "placeholderIcon": "🗺️",
  "assetUrl": null,
  "thumbnailUrl": null,
  "dimensions": null,
  "attributionSource": null
}
```

### Required Fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique asset ID. Follow naming convention above. |
| `type` | string | Asset type. See Asset Types section below. |
| `title` | string | English title for the asset. Shown as the image card heading. |
| `subtitle` | string | Indonesian subtitle. Shown as the secondary label on the card. |
| `moduleId` | string | ID of the module that owns this asset. |
| `sectionId` | string | ID of the section within the module where this asset is used (e.g., `"s01"`, `"s04"`). |
| `sectionTitle` | string | Title of that section. Used for display grouping. |
| `alt` | string | Accessible alt text describing the image in detail. Must be substantive — minimum 15 words. Used for accessibility and as fallback text. |
| `tags` | array of strings | 3–6 descriptive tags. Used for search and filtering. All lowercase. |
| `status` | string | Asset status. See Status Values section below. |
| `placeholderColor` | string | Hex color used to render the placeholder card background while the real asset is unavailable. |
| `placeholderIcon` | string | Emoji icon displayed on the placeholder card. |

### Optional Fields

| Field | Type | Notes |
|---|---|---|
| `assetUrl` | string or null | URL or path to the actual image/3D file once available. `null` until asset is uploaded. |
| `thumbnailUrl` | string or null | URL or path to a thumbnail version. `null` until available. |
| `dimensions` | object or null | `{ "width": 1200, "height": 800 }` once known. `null` for placeholders. |
| `attributionSource` | string or null | Attribution or license note for the asset source. `null` for internally generated assets. |

---

## ASSET TYPES

| Type Value | Indonesian | When to Use |
|---|---|---|
| `"infographic"` | Infografis | Multi-element visual combining statistics, labels, and layout |
| `"chart"` | Grafik/Bagan | Data visualization: bar chart, line graph, pie chart |
| `"diagram"` | Diagram | Pathophysiology flowcharts, mechanism diagrams, process flows |
| `"diagram_3d"` | Diagram 3D | Rendered 3D anatomical or molecular diagrams (Surface 13) |
| `"anatomy"` | Anatomi | Labeled anatomical illustrations |
| `"radiology"` | Radiologi | CT scans, MRI sequences, X-rays, angiograms |
| `"flowchart"` | Algoritma/Alur | Clinical decision trees and diagnostic algorithms |
| `"timeline"` | Timeline | Time-sequence diagrams (e.g., treatment windows) |
| `"comparison"` | Perbandingan | Side-by-side comparisons of two or more entities |
| `"reference_card"` | Kartu Referensi | Compact reference cards (scoring systems, drug dosing, checklists) |
| `"protocol"` | Protokol | Clinical protocols and management flowcharts |
| `"procedure"` | Prosedur | Step-by-step procedural illustrations |
| `"equipment"` | Alat/Perangkat | Medical devices and equipment illustrations |
| `"algorithm"` | Algoritma | Decision algorithms (distinct from flowcharts by complexity) |
| `"table"` | Tabel | Data tables (e.g., drug comparison tables, classification tables) |

---

## STATUS VALUES

| Status | When to Use |
|---|---|
| `"placeholder"` | Entry registered; no actual asset file yet. The app renders a colored placeholder card. |
| `"ai_generated"` | Asset was generated by an AI image tool (e.g., DALL-E, Midjourney, Stable Diffusion). Under review. |
| `"final"` | Asset has been approved and the actual image/model file is linked via `assetUrl`. |
| `"archived"` | Asset is no longer used in the current module version. Kept for historical reference. |

Default for new entries created by AI agents: `"placeholder"`.

---

## PLACEHOLDER COLOR PALETTE

Use these standard colors to distinguish asset types visually in placeholder state. Assign one color per asset type to ensure visual consistency.

| Asset Type | Recommended Color | Hex |
|---|---|---|
| infographic | Blue | `#3B82F6` |
| chart | Indigo | `#6366F1` |
| diagram | Red | `#EF4444` |
| diagram_3d | Amber | `#F59E0B` |
| anatomy | Pink | `#EC4899` |
| radiology | Slate | `#64748B` |
| flowchart | Orange | `#F97316` |
| timeline | Emerald | `#10B981` |
| comparison | Sky | `#0EA5E9` |
| reference_card | Purple | `#8B5CF6` |
| protocol | Dark Red | `#DC2626` |
| procedure | Fuchsia | `#C026D3` |
| equipment | Violet | `#9333EA` |
| algorithm | Dark Green | `#065F46` |
| table | Teal | `#0D9488` |

These are guidelines, not strict rules. For sections with multiple assets of the same type, vary shades (e.g., `#1D4ED8` for a second radiology asset) to distinguish cards visually.

---

## PLACEHOLDER ICON BY ASSET TYPE

| Asset Type | Icon |
|---|---|
| infographic | 📊 |
| chart | 📈 |
| diagram | ⚡ |
| diagram_3d | 🧠 |
| anatomy | 🗺️ |
| radiology | 📷 or 🩻 |
| flowchart | 🔀 |
| timeline | ⏱️ or ⏰ |
| comparison | 🔬 |
| reference_card | 📋 or 📝 |
| protocol | 🚨 |
| procedure | 🏥 |
| equipment | 🔧 |
| algorithm | 🛡️ |
| table | 📋 |

---

## BATCH-ADDING NEW ASSETS

When adding a set of assets for a new module section, use this process to avoid breaking existing entries.

### Step 1 — Read the current manifest

Read the existing `visual_asset_manifest.generated.json`. Note:
- The current `totalAssets` count
- The highest existing asset ID number for each module_short prefix to avoid ID collisions

### Step 2 — Append new entries

Add new asset objects to the END of the `assets[]` array. Do not insert in the middle (this risks accidentally deleting existing entries during edits).

### Step 3 — Update totalAssets

After appending N new assets:
```
totalAssets (new) = totalAssets (old) + N
```
Verify: `totalAssets === assets[].length`

### Step 4 — Update generatedAt

Update `generatedAt` to today's date.

### Step 5 — Validate no duplicate IDs

Scan the entire `assets[]` array and verify no two entries share the same `id`. This is a critical validation step.

### Step 6 — Validate JSON syntax

Parse the file as JSON. Fix any syntax errors before saving.

---

## HOW SURFACE 12 (PageImageCard) LOADS ASSETS

Surface 12 renders assets within module sections. For each section, it:
1. Reads the `sectionId` from the current module section
2. Queries the manifest for all assets where `sectionId` matches
3. Renders each matching asset as an image card in the section

If `status` is `"placeholder"`:
- Renders a colored rectangle using `placeholderColor`
- Overlays `placeholderIcon` emoji
- Shows `title` and `subtitle` as text labels
- Does not attempt to load any image file

If `status` is `"ai_generated"` or `"final"`:
- Loads image from `assetUrl`
- Falls back to placeholder rendering if `assetUrl` is null or the file is unavailable

## HOW SURFACE 13 (MediaViewer3D) LOADS ASSETS

Surface 13 looks specifically for assets with `type: "diagram_3d"`. It:
1. Identifies all 3D assets linked to the current module
2. Renders an interactive 3D viewer when `assetUrl` is present
3. Falls back to a static image card when only a thumbnail is available
4. Shows the placeholder card when both URLs are null

---

## VALIDATION: NO DUPLICATE IDs

Before saving any update, run a uniqueness check on all asset IDs.

Quick manual check: Sort all `id` values alphabetically and scan for consecutive identical values.

Automated check (if running in a script environment):
```javascript
const ids = assets.map(a => a.id);
const hasDuplicates = ids.length !== new Set(ids).size;
```

If duplicates are found: rename the newer asset (increment the suffix number) and update all `visual_ref` references in the affected module.json files.
