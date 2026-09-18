# Publish NoteFlow

NoteFlow is prepared for deployment as one Docker web service. The frontend and API share the same HTTPS origin, so no browser CORS configuration or `localhost` URL is required.

## Before publishing

The current product has no accounts or sign-in. Every visitor to a public deployment can read, create, edit, pin, and delete every note. Do not publish private, personal, or confidential notes until authentication and per-user data isolation are added.

## Recommended: Render

1. Create a private GitHub repository and upload this `NoteFlow` folder.
2. In Render, choose **New > Blueprint**, connect that repository, and accept `render.yaml`.
3. Render builds the included `Dockerfile`, attaches a persistent 1 GB disk at `/app/data`, and provides an HTTPS `onrender.com` URL.
4. Open the URL from a phone and desktop browser. In Chrome or Edge, use **Install app**; on iPhone/iPad, use Safari **Share > Add to Home Screen**.

The persistent disk is important: it preserves the built-in H2 database across restarts. A paid Render instance is specified because persistent disks are not available on free instances.

## Alternative database

To use MySQL instead of the included H2 database, set `MYSQL_URL`, `MYSQL_USERNAME`, and `MYSQL_PASSWORD` in the hosting provider’s environment settings. Leave them unset to use the persistent H2 file database.
