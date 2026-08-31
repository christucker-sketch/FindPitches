# FindPitches

FindPitches is the customer-facing foundation for a global vendor-opportunity platform. This repository separates the international web product from the legacy `christucker-sketch/PitchListUK` application before additional country editions are built.

## Architecture

- `platform/countries.mjs` is the global registry for active and planned countries.
- `platform/routing.mjs` resolves country context from canonical paths and legacy hosts.
- `platform/web-shell.mjs` defines shared navigation, categories and country selection.
- `platform/country-pages.mjs` maps each implemented country to its static page module.
- `src/<country>/` holds country-specific HTML, CSS and browser code on the shared shell.
- `functions/_middleware.js` preserves the approved host-routing contract for a future Pages deployment.

The frontend deliberately stays static HTML, CSS and JavaScript. Acquisition, source discovery, customer/account history and operational workflows are not part of this repository.

## Current status

- **US:** migrated customer-facing home and finder foundation. The current routing contract retains the existing US root behavior until a controlled global-root cutover.
- **UK:** redesigned `/uk/` page is staged and `noindex`; it is not published as the live UK product.
- **Future countries:** Canada, Australia, New Zealand and Ireland are registered as planned modules. The global root is intended to become the international landing page later.

`PitchListUK` remains the legacy production repository and is unchanged by this migration. No domain, DNS, Cloudflare Pages project or production switch is configured here yet.

## Development

```sh
npm ci
npm run verify
```

`npm run build` copies the static source tree into the ignored `public/` output directory. Pull requests and pushes to `main` run the same build, structural checks and focused platform tests in GitHub Actions.
