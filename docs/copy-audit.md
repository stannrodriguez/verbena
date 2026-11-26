# Copy Audit: Radix (verbena)

## Issues found and changes made

- **Metadata and titles (`index.html`, `site.webmanifest`, `styleguide.html`)**: Replaced em dashes with colons, dropped the repeated "Radix" prefix from the meta description, and removed "(desktop)"/"(mobile)" jargon from navigation `aria-label` attributes.
- **Wrong button names on About screen (`radix.js`)**: Updated "Again, Good, or Easy" to match the actual rating buttons ("Not yet, Knew it, or Easy").
- **Inaccurate specimen plate part-of-speech label (`radix.js`)**: Removed hardcoded "verb" from `spec-label` because over 40 roots in the folio are nouns, adjectives, or adverbs.
- **Misleading Compose button and hint link (`radix.js`)**: Changed disabled CTA "Place a root to check" to "Choose a root from the tray" (tiles check immediately), capitalized "Continue", and changed "show me the root" to "view root of the day" to match its `spect` plate target.
- **Misleading Library search and empty state (`radix.js`)**: Scoped placeholder and `aria-label` to the active category (`Search roots/prefixes/suffixes`), updated the empty state to name the active category and suggest switching, and added the Oxford comma to the subtitle.
- **Vague buttons and unclear subtitles (`radix.js`)**: Updated "Begin another" to "Begin another session", "Plant it" to "Plant in garden", and "Welcome back. The garden kept." to "Your pressed roots, from seedling to bloom."
- **Accessible Settings labels, hints, and error state (`radix.js`)**: Gave each stepper button a distinct `aria-label`, clarified JSON export/import and reset hints, made reset confirmation device-neutral ("Confirm reset", "select reset again to confirm"), and specified JSON in the import error toast.
- **Inconsistent toasts and About prose (`radix.js`)**: Unified review rating and planting toasts without em dashes, softened "Most English words" to "Many English words", fixed a comma splice in the spaced-review note, and replaced "Tap" with "Select".
- **Em dashes in glosses and session cards (`radix.js`)**: Replaced em dash separators in `ROOTS` derivatives, `delight` notes, and `SESSION` prompts with colons, semicolons, commas, or parentheses while preserving all authored wording verbatim.
- **Styleguide and README (`styleguide.html`, `README.md`)**: Removed em dashes and the weight-range en dash (replaced with actual weights `400, 500, 700`), added the missing "Purpose" table header, and tightened figurative prose in the parse caption.

## Left alone on purpose

- **Authored lexicon wording (`ROOTS`, `MORE_ROOTS`, `PREFIXES`, `SUFFIXES`, `SESSION`)**: Preserved all Latin forms, English meanings, derivatives, delight notes, and Latin motto ("festina lente" / "make haste slowly"). Kept prefix/suffix dash notation in `PREFIXES` and `SUFFIXES` because those mark attachment points rather than prose.
- **Sample dates and garden counts**: Left hardcoded dates (`planted june 30`, etc.) and sample totals (`12`, `23`, `3 in bloom`, `4 in bloom`) untouched to avoid inventing data or changing logic.
- **Pre-rendered social card (`og-card.svg`)**: Already concise with no em dashes; left untouched to stay in sync with `og-card.png`.
- **Code comments (`radix.js`, `radix.css`)**: Internal comments are not user-facing copy.

## Not done (next pass)

- Aligning the closing screen tally (`23 + state.planted`, `4 in bloom`) with the Garden header (`12 + state.planted`, `3 in bloom`) requires logic changes outside copy scope.
- Linking Compose's `show-root` action to the active card's root instead of always opening `spect` requires a logic change.
