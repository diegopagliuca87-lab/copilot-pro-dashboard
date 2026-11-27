# copilot-pro-dashboard
A polished Next.js dashboard demonstrating modern frontend, TypeScript, and Copilot-assisted engineering.

## Features

- **Overview**: stat cards, a weekly commit chart, and recent activity
- **Projects**: all repositories with language, stars, open issues, and last update
- **Activity**: a timeline of commits, issues, and pull requests
- **Copilot**: how GitHub Copilot contributed to building this dashboard
- Responsive layout (desktop sidebar, mobile top navigation) and automatic dark mode

The data is currently sample data from `src/lib/data.ts`. Live GitHub data is the next step.

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
npm run build   # production build
```

## Project structure

```
src/
  app/            pages (overview, projekte, aktivitaet, copilot) and layout
  components/     sidebar, cards, chart, activity list
  lib/data.ts     sample data and types
```

## Roadmap

- [ ] Load live data from the GitHub API
- [ ] Loading and error states
- [ ] Automatic checks on every push (CI)
- [ ] Deploy (e.g. Vercel) and add the live link here
- [ ] Screenshots

## License

MIT
