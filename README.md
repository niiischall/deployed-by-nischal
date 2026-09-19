# deployed

Personal blog at [blog.nischalnikit.xyz](https://blog.nischalnikit.xyz) — built with Next.js 15, using Sanity as the CMS.

## Stack

- Next.js 15 (App Router, Turbopack)
- TypeScript + Tailwind CSS
- Sanity Content Lake + Studio
- remark / rehype for Markdown → HTML
- PostHog for analytics

## Local development

1. Clone the repo and install the dependencies:
   ```bash
   pnpm install
   ```
2. Create a `.env.local` file at the project root:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<your-sanity-project-id>
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-11-01
   # Optional: only needed when dataset is private
   SANITY_API_READ_TOKEN=<token-with-read-access>
   ```
3. Start the dev server:
   ```bash
   pnpm dev
   ```
4. (Optional) Run Sanity Studio locally:
   ```bash
   pnpm sanity:studio
   ```
   Studio is also embedded in this app at [http://localhost:3000/studio](http://localhost:3000/studio).

## Sanity setup

1. Create a Sanity project:
   ```bash
   pnpm dlx sanity@latest init
   ```
2. Use the same project id + dataset values in `.env.local`.
3. Open Studio (`/studio`) and create:
   - At least one `author` document (optional but recommended). Upload a
     `picture` — it drives the post byline and the `Person` structured data.
   - Any `tag` documents. Each needs a `slug`; that is what publishes the tag's
     hub page at `/tags/{slug}`. Tags without a slug are skipped everywhere.
   - A `post` document with:
     - `title`
     - `slug`
     - `excerpt`
     - `publishedAt`
     - `markdown` (required; this is rendered by the frontend)
     - optional `coverImage` (or `coverImageUrl` fallback during migration)
     - optional `ogImage` — see below
     - optional `seoTitle` / `seoDescription` to override the search snippet
4. Publish the post from Studio.

### Social share cards

Link previews on LinkedIn, X and Slack resolve in this order:

```
post.ogImage  →  post.coverImage  →  src/app/opengraph-image.png (site default)
```

Upload a **1200x630** PNG to `ogImage` when a post deserves a purpose-built card
(one with the headline set in type reads better than a photo). Leave it empty and
the cover image is used automatically — no code change either way.

Social platforms cache the first scrape aggressively (LinkedIn for roughly a
week), so run a new post through the
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) before
sharing it, not after.

## Content migration helper

Use the included script to convert a JSON export into Sanity import NDJSON:

```bash
pnpm sanity:prepare-import ./path/to/posts.json ./scripts/sanity-import.ndjson
```

Input JSON can be either:

- An array of posts, or
- An object containing a `posts` array

Each post may contain fields like:
`title`, `slug`, `subtitle`/`excerpt`, `publishedAt`, `coverImage.url`, `content.markdown`, optional `author.name`, optional `tags`.

Then import into Sanity:

```bash
sanity dataset import ./scripts/sanity-import.ndjson production
```

## Project structure

```
src/app/              — App Router pages and root layout
src/app/_components/  — UI components (header, post body, theme switcher, …)
src/lib/              — API helpers, Sanity client/queries, markdown utilities
src/sanity/           — Sanity schema definitions
scripts/              — migration/import helper scripts
public/               — Static assets and favicons
```

## Deploy (Vercel)

Set these environment variables in Vercel:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_READ_TOKEN` (only if dataset is private)
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST` (for client-side tracking)
- `POSTHOG_PROJECT_ID` (for server-side lifetime post views)
- `POSTHOG_PERSONAL_API_KEY` (for server-side PostHog query API access)
- `POSTHOG_HOST` (optional, defaults to `NEXT_PUBLIC_POSTHOG_HOST` when omitted)

Then redeploy. Pushing to `main` triggers a production build.
