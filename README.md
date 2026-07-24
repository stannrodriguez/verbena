# Radix

A herbarium of Latin roots. Learn vocabulary by *pressing roots like
specimens*: parse a word into its roots, compose meanings from prefix +
root, and grow a garden of what you know.

This is a faithful implementation of the **Radix** design
(`Radix.dc.html`) — both the mobile screens and the desktop web views.

## Run

It's a static site — no build step.

```bash
python3 -m http.server 8099
# open http://localhost:8099
```

Or just open `index.html` in a browser.

## What's here

| File | |
|------|--|
| `index.html` | App shell — responsive: top nav on desktop, bottom tab bar on mobile |
| `radix.css` | The visual system — tokens, type roles, and every screen's layout |
| `radix.js` | Data (roots, session, garden), the `sprig()` plant generator, screens, routing, interactions |
| `styleguide.html` | The visual system reference (design screen 1a) |

## Screens

- **Today** — a session of cards. *Decompose* (reveal a word's roots, then
  rate recall) and *Compose* (assemble a meaning from prefix + root). Ends
  on a closing screen.
- **Garden** — your roots as pressed specimens, drawn as plants that grow
  from seedling to bloom. Desktop shows a specimen plate alongside.
- **Library** — a searchable folio: **110 Latin roots** (each with its
  meaning and four derivatives), **30 prefixes**, and **20 suffixes**.
  Search filters within the active category; tapping a root opens its
  specimen plate.
- **About** — how Radix works (the two Today modes, the growing garden,
  the folio, and the spaced-review method), followed by settings: new
  roots/day, reviews/day, export / import, reset. Everything is local: no
  accounts, no analytics.

## Design system

Palette (*pressed & dried*): paper `#F5F0E4`, plate `#FBF8EF`, ink
`#2E2B22`, leaf `#55643F`, moss `#8A9070`, petal `#A56A54`, fade `#A79E8B`.

Type roles: Latin display in *Cormorant Garamond italic* (always green),
English headwords in Cormorant Garamond roman, body/UI in Alegreya Sans,
specimen labels in letterspaced Cutive Mono.

The **parse signature** — segments part and hairline leaders drop to the
Latin beneath — appears everywhere a word is explained.

The **sprig** mark grows with mastery: a stem, then leaf-pairs, then five
petals at full bloom. It's generated procedurally in `radix.js`.
