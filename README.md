# Yard Flow — Interactive Journey Map

A bilingual (English / فارسی) visual story of how Yard Flow works: 12 cargo chapters, 7 role day-in-the-life views, and all 70 screen mockups.

**Live site:** https://koushyarhb.github.io/yard-flow-journey-map/

## Open locally

```bash
npx serve .
```

Then open http://localhost:3000

## Rebuild from source

This site is generated from `tms.frontend/docs/proposals/yard-flow/`. To refresh:

```bash
node docs/proposals/yard-flow/_tooling/build-pages-deploy.mjs
```

## Contents

- **Start** — overview and lifecycle spine
- **Cargo story** — 12 chapters from order to ship
- **By role** — supervisor, control office, gate, etc.
- **Glossary** — bilingual domain terms (Kotaj, depot, Bijak, gate security, …)
- **Domain model** — full domain analysis v6.1 (EN / FA, ~4000 lines each)

Language toggle: EN / فا (top right). Farsi uses Yekan Bakh; English uses Roboto — same fonts as the TMS app.
