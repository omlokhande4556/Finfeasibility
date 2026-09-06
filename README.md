# Rural Advisor — Frontend (SIH26091)

Frontend-only starter for the *AI-Driven Hyper-Local Business Advisory and
Financial Structuring Assistant for Rural Micro-Entrepreneurs*.

Built with **Next.js 14 (App Router)**, **React 18**, and **Tailwind CSS**.
No backend yet — the "Check My Idea" page shows a mock result so the UI can
be demoed end-to-end.

## Pages

- `/` — Landing page: hero, problem/solution, how-it-works, features, CTA
- `/idea-check` — Form that collects idea details and shows a placeholder
  viability result (swap the `setTimeout` in `app/idea-check/page.js` for a
  real `fetch` call once the backend exists)

## Getting started locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Project structure

```
rural-advisor-frontend/
├── app/
│   ├── layout.js        # root layout, wraps every page with Navbar/Footer
│   ├── globals.css       # Tailwind + custom .input utility class
│   ├── page.js           # home page
│   └── idea-check/
│       └── page.js       # idea evaluation form (client component)
├── components/
│   ├── Navbar.js
│   ├── Footer.js
│   ├── Hero.js
│   ├── FeatureCard.js
│   └── WorkflowSteps.js
├── tailwind.config.js     # brand colors (primary/secondary/accent)
├── next.config.mjs
└── package.json
```

## Next steps

- Add a backend (API routes or a separate service) and replace the mock
  result in `idea-check/page.js`
- Add authentication if entrepreneur profiles need to be saved
- Connect real hyper-local market data sources
