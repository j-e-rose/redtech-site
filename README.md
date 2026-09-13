# REDTech Solutions

Static marketing site at https://redtech.app. No build step or runtime dependencies.

## Local preview

Run `python3 -m http.server 4173 --bind 127.0.0.1`, then open http://127.0.0.1:4173.

`index.html` contains the content. `assets/site.css` holds the responsive design, and `assets/site.js` adds project filters, featured-project selection, mobile navigation, and native image dialogs. Case details and FAQs use native disclosure elements. Core content and navigation remain available without JavaScript. Fonts are self-hosted with their licenses in `assets/fonts/`.

The WebP screenshots are optimized copies of the existing, redacted PNG portfolio assets. Full-size previews use the original PNGs; preserve their redactions when replacing images. Portfolio work includes both institutional and consulting projects.

## Deployment

Pushes to `main` deploy through `.github/workflows/deploy.yml` to Firebase Hosting site `redtech-strategy`, project `studio-8747237902-e6930`, owned by `justin.edw.rose@gmail.com`. The repository is `j-e-rose/redtech-site`. This is separate from SEU's GCP projects.

Verify desktop and phone layouts, category filters, deep links, keyboard navigation, FAQ disclosures, and image dialogs before pushing. Run `node --check assets/site.js` and `git diff --check` for basic source checks. Analytics runs only on the production hostnames; local and preview hosts are excluded.

To roll back a release, revert its commit and push to `main`, then verify the Firebase deploy workflow completes successfully.
