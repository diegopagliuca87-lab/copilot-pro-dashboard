# copilot-pro-dashboard
A polished Next.js dashboard demonstrating modern frontend, TypeScript, and Copilot-assisted engineering.

**Live:** https://copilot-pro-dashboard.vercel.app

## Features

- **Overview**: stat cards, a weekly commit chart, and recent activity
- **Projects**: all repositories with language, stars, open issues, and last update
- **Activity**: a timeline of commits, issues, and pull requests
- **Copilot**: how GitHub Copilot contributed to building this dashboard
- Responsive layout (desktop sidebar, mobile top navigation) and automatic dark mode

Projects, stats, the commit chart, and activity come **live from the GitHub API** (cached for a few minutes).
The Copilot page uses sample values, because GitHub only offers Copilot metrics for organizations.

### Configuration (optional)

| Variable | Purpose |
|---|---|
| `GITHUB_USERNAME` | Whose data to show (default: `diegopagliuca87-lab`) |
| `GITHUB_TOKEN` | Higher API rate limit and your private repositories. Set it in `.env.local` or your host's settings, never commit it. |

Without a token the dashboard shows public data only (60 GitHub requests per hour).

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) with TypeScript
- Tailwind CSS 4
- No chart library: the charts are plain HTML/CSS

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run lint    # check code style
npm test        # unit tests (vitest)
npm run build   # production build
```

## Project structure

```
src/
  app/            pages (overview, projekte, aktivitaet, copilot) and layout
  components/     sidebar, cards, chart, activity list
  lib/data.ts               shared types and Copilot sample values
  lib/github.ts             loads live data from the GitHub API (cached)
  lib/github-transform.ts   turns API responses into dashboard data (unit tested)
```

## Roadmap

- [x] Load live data from the GitHub API
- [x] Loading and error states
- [ ] Automatic checks on every push (CI)
- [x] Deploy on Vercel (every push to `main` deploys automatically)
- [ ] Screenshots

## License

MIT
