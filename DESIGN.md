---
name: "AEGIS"
description: "An editorial presentation of local control, system boundaries and traceable evidence."
colors:
  cream: "#faf8f2"
  paper: "#fffefa"
  ink: "#17182f"
  muted: "#565778"
  purple: "#6932e9"
  purple-deep: "#4d22cc"
  blue: "#365eea"
  coral: "#ed725c"
  lime: "#a2bf35"
  line: "#d8d4eb"
  purple-soft: "#eee7ff"
  blue-soft: "#e9efff"
  coral-soft: "#fff0e9"
  lime-soft: "#f3f7e1"
typography:
  display:
    fontFamily: "'Manrope Variable', 'Noto Sans Thai', sans-serif"
    fontSize: "95px"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-.04em"
  headline:
    fontFamily: "'Manrope Variable', 'Noto Sans Thai', sans-serif"
    fontSize: "70px"
    fontWeight: 780
    lineHeight: 1.08
    letterSpacing: "-.04em"
  chapter:
    fontFamily: "'Manrope Variable', 'Noto Sans Thai', sans-serif"
    fontSize: "88px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-.04em"
  body:
    fontFamily: "'Manrope Variable', 'Noto Sans Thai', sans-serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.5
  tag:
    fontFamily: "'Manrope Variable', 'Noto Sans Thai', sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  panel: "28px"
  inspector: "16px"
  button: "55px"
  tag: "35px"
  dialog: "24px"
spacing:
  space-1: "8px"
  space-2: "16px"
  space-3: "24px"
  space-4: "32px"
  space-5: "48px"
  space-6: "64px"
  space-7: "80px"
components:
  button-primary:
    textColor: "#ffffff"
    rounded: "{rounded.button}"
    padding: "23px 27px 23px 38px"
  tag:
    backgroundColor: "{colors.purple-soft}"
    textColor: "{colors.purple-deep}"
    rounded: "{rounded.tag}"
    padding: "12px 19px"
    typography: "{typography.tag}"
  evidence-panel:
    backgroundColor: "{colors.paper}"
    rounded: "22px"
    padding: "25px 28px"
  dialog:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.dialog}"
    padding: "30px"
---

# Design System: AEGIS

## Overview

**Creative North Star: "Approved editorial presentation"**

AEGIS uses the approved cream, violet, royal blue and coral editorial presentation world: oversized typography, asymmetric compositions, rounded panels and geometric arcs. The technical content stays legible against warm paper, while gradients connect major headings, actions and the active chapter capsule.

Original university and project marks anchor the identity. Generated monument artwork is decorative; application captures and recordings have explicit evidence states. This records the implemented React presentation, with source CSS and component behavior taking precedence over earlier plans.

**Key Characteristics:**

- Oversized gradient headings and approved chapter identifiers.
- Warm cream canvas, dark navy text and softly tinted panels.
- Asymmetric editorial layouts with circular arcs and restrained ambient depth.
- Fixed recording composition with a separate reflowing reading mode.
- Evidence labels and optional motion remain part of the interface.

Source snapshot: src/styles.css, src/App.tsx, src/hooks/usePresentation.ts, src/components/Scenes.tsx, src/components/MediaFrames.tsx and src/components/TechnicalDiagramStage.tsx. Direction authority: PRODUCT.md and docs/DESIGN_DIRECTION.md. The sidecar's synthesized tonal ramps are preview aids, not additional shipped palette tokens.

## Colors

Violet leads the actions, royal blue and coral distinguish technical subjects, and occasional lime supplies supporting emphasis. Cream and paper hold dark ink and muted explanatory text.

### Primary

Purple and purple-deep support actions and emphasis. The implemented gradient is linear-gradient(115deg, #a456f3, #652ced 54%, #374eff); it appears on highlighted headline spans, primary actions, chapter selection and progress.

### Secondary

Blue supports security and pending contexts; coral supports Monitor and limitation contexts. Explicit state wording determines the meaning.

### Tertiary

Lime is a supporting accent for selected feature groups. Soft palette counterparts supply quiet tinted surfaces.

### Neutral

Cream is the stage, paper the brighter panel, ink the principal text, muted the explanatory text, and line the divider. Component tone classes have their own accent/background/ink triplets; they are documented in the sidecar rather than silently equated to root colors.

**The Evidence State Rule.** Keep reported, limited and pending states explicit in words; color alone never establishes evidence.

## Typography

Manrope Variable supplies Latin display and body text. Noto Sans Thai supports the original student names and the fallback stack; the application imports its 400 and 500 weights. No separate mono face is installed.

The frontmatter records actual roles rather than a mathematical scale. Feature display uses 95px, scene headlines 70px and chapter titles 88px. The cover wordmark is a separate identity treatment (225px, weight 850, line height .95, tracking -.06em, skew -4deg); it is not a general heading size. The background statement reaches 100px and closing headline 142px. Normal explanatory scene text uses 26px with 1.5 line height and up to 68ch. Individual cards use 21–24px body text. Final diagram labels are 20px titles and 15px subtitles/edge labels.

Reading mode gives standard scene headings clamp(34px, 4.7vw, 62px), with further scene-specific mobile sizes. Preserve those overrides instead of scaling body text down with the recording canvas.

## Layout

**The Recording Frame Rule.** Compose presentation mode at 1920 × 1080 and scale the complete stage uniformly; use reading mode for reflow.

The stage is centered in the viewport using the smaller width/1920 or height/1080 ratio. The masthead sits 30px from the top and 68px from either side; ordinary scenes use insets of 177px 84px 126px. Cover and closing scenes fill the stage. The footer sits 25px from the bottom with 84px side insets. There are 17 scenes and no automatic advance.

Layouts vary with the content: asymmetric two-column stories, three overview chapter cards, feature grids, diagram plus inspector, and screenshot plus recording stages. Spacing custom properties expose the 8–80px scale recorded above, while current layouts also use direct composition-specific gaps and padding; the implementation does not exclusively consume that scale.

Portrait viewports narrower than 900px default to reading mode. The user can select either mode. Reading mode places header, scene and footer in document flow, removes fixed stage dimensions, and uses 35px side padding. The CSS breakpoint is max-width: 899px; narrow reading layouts stack content and expose textual diagram nodes and relationships. Native dialogs use viewport-relative maximum dimensions. Print styling exposes the current scene, not an automatic 17-page export.

## Elevation & Depth

Depth combines tonal panels, fine tinted borders, translucent washes and diffuse shadows. The shared panel shadow is 0 22px 60px -24px #30207526, 0 4px 12px -4px #3020750d. The primary action has a stronger violet shadow, increasing on hover. The native dialog has a deep shadow and blurred backdrop. These source values live in the sidecar. Decorative arcs remain behind the reading surface.

## Shapes

Rounded panels commonly use 28px; the inspector uses 16px. Larger editorial surfaces vary from 24–38px. Actions and navigation are pill or circular forms, and decorative orbits use true circles. Media frames use 27px screenshot and 25px video corners with clipping. SVG diagram nodes use 20px corner radii; planned nodes and edges use dashed strokes.

## Components

### Buttons

The primary action combines the violet-blue gradient, white text, 26px type at weight 650, a pill outline and a circular trailing SVG arrow. Hover strengthens its shadow. Shared buttons use a 3px purple-deep focus outline with 5px offset, short color/shadow transitions and brightness(.97) while pressed. Disabled buttons have .4 opacity. Previous/next controls are circular; utility controls are smaller circles; the closing text action has a transparent background.

### Tags and evidence panels

Tags pair a tinted background, tone-specific dark text and a fine mixed-color border. They describe categories and status. Evidence panels use paper for reported, pale coral for limited, and pale blue for pending, with a title, explanatory paragraph and SVG icon.

### Cards

Chapter cards, feature choices and summary cards share rounded tinted surfaces, fine borders where interactive, and diffuse shadows. Selected feature choices strengthen their tone border and shadow. Keep chapter identifiers: the owner explicitly approved them as part of this world.

### Navigation and dialogs

The chapter rail has a 65px capsule containing 55px buttons at 21px. Its active gradient indicator moves with GSAP Flip (480ms, power3.out); the closing scene selects overview. Footer controls expose the scene chooser, sources, reading mode, motion and fullscreen. Arrow keys and Page Up/Down navigate; F toggles fullscreen. Local editable/media controls and open dialogs suppress presentation shortcuts. Scenes receive focus after navigation and announce their position. Native modal dialogs supply focus containment and browser focus restoration; scene selection subsequently focuses the selected scene.

### Motion

**The Optional Motion Rule.** System reduced motion and the motion control suppress scene animation, chapter morphing, parallax and decorative diagram flow.

Forward and reverse navigation use direction-dependent horizontal exits (110px, 220ms, power2.in) and entrances (95px, 550ms, power3.out). Child reveals use 500ms with 180ms total stagger; the cover art reveals over 800ms. Reading mode also skips scene animation. Fine-pointer parallax is limited to ±5px and disabled in reading mode. Diagram flow uses a 6s linear loop and is explicitly illustrative. Motion off hides flow and reduces progress transitions to 100ms; it does not remove all short control transitions.

### Technical diagrams

SVG nodes are clickable and keyboard operable with Enter/Space. Selection updates an aria-live inspector. Solid edges mean reported relationships; dashed edges mean prepared or pending integration. Narrow reading mode provides the node controls and relationship list as text.

### Media stages

Screenshot and video viewports preserve 16:9 and contain supplied media. Pending images read “Awaiting actual system screenshot”; pending recordings read “Real recording coming next.” Failed files produce an unavailable message. Gallery choices expose aria-pressed. Real video playback is manual with native controls, playsInline and metadata preload; caption tracks are attached only when provided. Generated artwork never substitutes for these evidence slots.

## Do's and Don'ts

### Do:

- Do retain the approved large gradient headings, rounded panels and chapter identifiers.
- Do preserve the supplied original marks and keep generated artwork identified as illustrative.
- Do use semantic controls, visible focus and explicit selected or pressed states.
- Do maintain 16:9 media stages and readable missing or unavailable messages.

### Don't:

- Don't present decorative diagram flow as live telemetry.
- Don't substitute generated application screens for original system evidence.
- Don't auto-advance scenes or autoplay recordings.
