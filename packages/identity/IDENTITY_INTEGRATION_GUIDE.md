# IDENTITY_INTEGRATION_GUIDE.md
# CORTEX-SHELL — How App Identity Flows into the Application
# Version: 1.0 | Batch 5 | Date: 2026-06-10

---

## OVERVIEW

`app_identity.json` is loaded at startup alongside `app_config.json`. Once loaded, it flows
through the `appIdentity` prop to all surfaces that need identity data.

---

## LOAD FLOW

```
App startup
    │
    ├── fetch app_data/system/identity/app_identity.json
    │       └── setAppIdentity(data)
    │
    ├── fetch app_data/system/config/app_config.json
    │       └── setAppConfig(data)
    │
    └── sharedProps.appIdentity = appIdentity
        sharedProps.appConfig   = appConfig
```

---

## SURFACE CONSUMPTION MAP

Which surfaces use which identity fields:

| Surface | Field Path | Used For |
|---|---|---|
| S1 PageWelcomeRefined | `appIdentity.welcome.headline` | App name on welcome screen |
| S1 PageWelcomeRefined | `appIdentity.welcome.subtitle_badge` | Badge text below name |
| S1 PageWelcomeRefined | `appIdentity.welcome.tagline` | Description paragraph |
| S1 PageWelcomeRefined | `appIdentity.welcome.loading_text` | Bottom loading text |
| S1 PageWelcomeRefined | `appIdentity.welcome.feature_badges` | 3 badge chips |
| S1 PageWelcomeRefined | `appIdentity.welcome.auto_advance_ms` | Auto-advance timing |
| S2 PageHome | `appIdentity.app.name` | App name in header |
| S2 PageHome | `appIdentity.content_domains` | Domain cards |
| S6 PageSearch | `appIdentity.navigation.*` | Section labels |
| S23 PageHelpAboutPrivacy | `appIdentity.about.text` | About page body |
| S23 PageHelpAboutPrivacy | `appIdentity.about.version_label` | Version display |
| S23 PageHelpAboutPrivacy | `appIdentity.institution.name` | Institution credit |
| S23 PageHelpAboutPrivacy | `appIdentity.help.intro_text` | Help page body |
| S23 PageHelpAboutPrivacy | `appIdentity.help.faq` | FAQ section |
| S23 PageHelpAboutPrivacy | `appIdentity.help.support_contact` | Contact link |
| S23 PageHelpAboutPrivacy | `appIdentity.privacy.text` | Privacy page body |
| All surfaces | `appIdentity.branding.*_color` | CSS custom properties |

---

## CSS CUSTOM PROPERTIES

When `appIdentity.branding` loads, these CSS variables are set on `:root`:

```css
--cortex-primary:        /* branding.primary_color */
--cortex-primary-light:  /* branding.primary_color_light */
--cortex-secondary:      /* branding.secondary_color */
--cortex-accent:         /* branding.accent_color */
--cortex-danger:         /* branding.danger_color */
--cortex-warning:        /* branding.warning_color */
```

These variables are referenced by callout components, button styles, and active states.

---

## FALLBACK CHAIN

If `app_identity.json` fails to load:

```
appIdentity === null
    → All surfaces use hardcoded default values
    → Welcome screen shows "CORTEX", default tagline, default badges
    → About/Help/Privacy show generic placeholder text
    → Colors remain at compiled defaults (#7c3aed primary)
```

The app remains fully functional without identity file — identity is enhancement only.

---

## HOW TO CUSTOMIZE FOR A NEW DEPLOYMENT

1. Fill out `APP_IDENTITY_QUESTIONNAIRE.docx`
2. Send to agent with `PROMPT_IDENTITY_AGENT.md` as system prompt
3. Save output as `app_data/system/identity/app_identity.json`
4. Open app — changes apply immediately on next load
5. No code changes required

---

## ADDING A NEW DOMAIN

To add a new medical subject domain:

1. Add to `app_identity.json` under `content_domains[]`:
```json
{
  "id": "new_domain_id",
  "display_name": "Domain Name",
  "icon": "🫀",
  "description": "Short description",
  "color": "#hex",
  "active": true
}
```

2. Add matching domain entry to `content_index.kimi.json`:
```json
{
  "id": "new_domain_id",
  "title": "Domain Title",
  "modules": []
}
```

3. Create the domain directory:
```
app_data/domains/materi/modules/[first_module_id]/
```

---

## CHANGING COLORS

1. Edit `branding.primary_color` in `app_identity.json`
2. Also update `branding.primary_color_light` (lighter shade of primary)
3. Save file
4. Reload app — CSS variables update automatically

**Color picker tools:** coolors.co, paletton.com, or any hex color picker

---

*Last updated: 2026-06-10 | Batch 5*
