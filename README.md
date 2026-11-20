# QuizMania

A full-stack quiz app built with Next.js, TypeScript and PostgreSQL. Pick a category and difficulty, answer against the clock, then review every question once you're done.

## Features

- Ten categories and three difficulty levels, with questions from [The Trivia API](https://the-trivia-api.com)
- Configurable quiz length (5 to 20 questions) and time limit (1 to 5 minutes, or none)
- Score page and a full answer review for every finished quiz
- Public profiles showing a user's most recent results
- Sign in with email and password or GitHub
- Light and dark themes, saved per user without a flash on load
- A feedback form backed by Formspree

## How a quiz works

Each quiz is a `QuizAttempt` stored in the database, and the server owns everything that decides the result.

1. Starting a quiz creates an attempt. The server fetches the questions, shuffles the options and stores them together with the correct answers.
2. The quiz page at `/quiz/[id]` loads the attempt without the correct answers, so they never reach the browser.
3. The timer is calculated from when the attempt was created, so refreshing the page doesn't reset it. The quiz submits itself when time runs out.
4. On submit, the server scores the picks against the stored answers, caps the time taken at the limit and marks the attempt complete. A second submit for the same attempt is rejected.
5. The score and review pages at `/quiz/[id]/score` and `/quiz/[id]/review` are only visible to the attempt's owner. Anyone else gets a 404.

## Security

- Passwords are hashed with bcrypt and never returned by the API
- Request bodies are validated with Zod on every API route
- Middleware protects `/settings` and `/quiz/*` and keeps signed-in users away from `/login` and `/signup`
- Users and quiz attempts use cuid ids, so records can't be found by guessing numbers
- Every attempt lookup is scoped to the signed-in user
- Profile pictures are limited to an allow-list of image hosts

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, with `dark:` variants and a few shared `@utility` classes |
| Data | PostgreSQL (Neon), Prisma |
| Auth | NextAuth.js (credentials and GitHub), bcrypt |
| Validation | Zod |
| State | Redux Toolkit for quiz preferences |
| Testing | Vitest, React Testing Library |

Pages that only display data, like profiles, scores and reviews, are server components. Client components are used where there is interaction, such as the quiz itself and the forms.

## Getting started

Requirements: Node.js 22 and a PostgreSQL database.

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run dev
```

Fill in `.env` before running the migration:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret used to sign session tokens |
| `NEXTAUTH_URL` | Base URL of the app, e.g. `http://localhost:3000` |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |

## Testing

```bash
npm test
```

The suite runs in Node and jsdom and never touches the database or the trivia API. It covers:

- Scoring: correct, wrong and unanswered picks, out-of-range picks, and the time cap
- Validation schemas and the server-side countdown
- The submit API: sign-in required, owner-only access, finished attempts, mismatched answers and double submits
- The quiz player: answering and submitting, the retry message on a failed save, and auto-submit on timeout

## Project structure

```
app/
  api/            Route handlers (quiz attempts, sign-up, profile)
  quiz/[id]/      Quiz player, score and review pages
  user/[username] Public profiles
  component/      Shared UI components
lib/              Auth, Prisma, quiz logic and helpers
prisma/           Schema and migrations
middleware.ts     Route protection
```

## Known limitations

- Picks made during a quiz live in the browser until submit, so refreshing keeps the timer but clears the answers
- Abandoned attempts stay in the database as incomplete and are hidden everywhere, but nothing cleans them up yet
- Async server components aren't covered by the unit tests; end-to-end tests with Playwright would be the next step
