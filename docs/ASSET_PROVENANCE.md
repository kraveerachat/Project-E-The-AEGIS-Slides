# Asset provenance

| File | Category | Origin / handling |
|---|---|---|
| `public/assets/branding/sut-standard.png` | REAL | Owner's original `SUT_standard.png`, with identical RGBA pixels and dimensions. Provenance text metadata added; transparent background and proportions retained. |
| `public/assets/branding/aegis-mark-dark-ink.png` | REAL | Owner's original AEGIS application asset, with identical RGBA pixels and dimensions. Provenance text metadata added. Used as a mark, alongside a separately typeset AEGIS wordmark. |
| `public/assets/generated/monument-arcs.png` | GENERATED | Generated specifically for this presentation from the owner's approved cover design reference. Decorative university-inspired monument/arches; never described as a documentary campus photo. |
| `docs/screenshots/*.png` | DECORATIVE / QA capture | Browser captures of this presentation, not AEGIS application screenshots or test evidence. |
| `public/assets/hardware/equipment-setup.png` | REAL | Owner's unchanged original Figure 3.6-12. SHA-256: D7C206C5FCF818C653AA92734AFA92577CA1CEFE85EE0D7CE41CDDF322DEFDB9. |
| `public/assets/hardware/lan-cable-switch.png` | REAL | Owner's unchanged original Figure 3.6-13. SHA-256: CE18A7F4FEAD4E0F6340AC018BBA3FCF2302404FCC2CCDA60D663170C2053AD7. |
| `docs/screenshots/v3/*.png` | QA capture | Fresh Chrome captures of the 18-scene TH/EN presentation. Not system screenshots. |
| `tests/fixtures/playback.mp4` | Test-only fixture | Neutral color clip for actual browser decoding/playback checks. Outside public assets and never presented as AEGIS behavior. |

The three approved reference images are owner-provided design authorities and remain outside the public repository. No stock assets or external image URLs are required at runtime.

Generation direction: isolate the right-hand monument composition from the approved cover; a tall golden Thai monument with statue and lotus-like pedestal, sunset sky and trees, violet/royal-blue arches, lilac translucent layers and a small coral crescent, on warm cream with feathered left edges. No text, logos, navigation, UI, metrics or fabricated documentary claims. Portrait 4:5 artwork for the landscape scene's right half. Embedded metadata records the generation origin and a summarized direction, not the unavailable verbatim prompt.

All future actual system captures must be supplied by the owner and marked REAL in the manifest. A generated image must never replace one of those entries.
