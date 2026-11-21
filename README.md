# QuizMania

A full-stack quiz app built with Next.js, TypeScript and PostgreSQL. Pick a category and difficulty, answer against the clock, then review every question once you're done.

## Features

- Ten categories and three difficulty levels, with questions from [The Trivia API](https://the-trivia-api.com)
- Configurable quiz length (5 to 20 questions) and time limit (1 to 5 minutes, or none)
- Score page and a full answer review for every finished quiz
- Unfinished quizzes can be resumed from the home page, with answers and remaining time kept
- Keyboard and screen reader friendly: answers, dialogs, menus and dropdowns all work without a mouse
- Custom dropdowns in place of the browser default, following the listbox pattern (arrow keys, Home, End, type-to-jump, Escape)
- Public profiles showing a user's most recent results
- Sign in with email and password or GitHub, or try it in one click with the shared test account
- Light and dark themes, saved per user without a flash on load
- A feedback form backed by Formspree

## How a quiz works

Each quiz is a `QuizAttempt` stored in the database, and the server owns everything that decides the result.

1. Starting a quiz creates an attempt with a deadline. The server fetches the questions, shuffles the options and stores them together with the correct answers.
2. The quiz page at `/quiz/[id]` loads the attempt without the correct answers, so they never reach the browser.
3. Each pick is saved to the server as soon as it's made, one request at a time with only the latest picks sent. Refreshing, closing the tab or switching devices keeps both the answers and the remaining time.
4. On submit, the server scores the picks against the stored answers, caps the time taken at the limit and marks the attempt as submitted. A second submit for the same attempt is rejected.
5. If the deadline passes without a submit, the attempt is finished as of the deadline using the picks saved by then, and marked as expired. This happens the next time the attempt, the owner's profile or the home page is loaded.
6. The score and review pages at `/quiz/[id]/score` and `/quiz/[id]/review` are only visible to the attempt's owner. Anyone else gets a 404.

## Security

- Passwords are hashed with bcrypt and never returned by the API
- Input is validated with Zod in every API route and Server Action
- Modules that touch the database or auth are marked `server-only`, so they can't end up in the browser bundle
- Middleware protects `/settings` and `/quiz/*` and keeps signed-in users away from `/login` and `/signup`
- Users and quiz attempts use cuid ids, so records can't be found by guessing numbers
- Every attempt lookup is scoped to the signed-in user
- The shared test account can take quizzes but its profile can't be edited, so its public page stays as it is
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

Pages are split into two route groups that don't change the URLs: `(main)` wraps the app in the navbar and footer, and `(auth)` gives the login and sign-up pages a minimal layout of their own. The root layout only holds the providers, fonts and theme script.

Pages that only display data, like profiles, scores and reviews, are server components. Client components are used where there is interaction, such as the quiz itself and the forms.

Profile settings are saved with a Server Action through `useActionState`, so the form shows its pending and saved states and still submits before JavaScript loads. Public profiles are cached with `unstable_cache` under a per-user tag; saving a profile or submitting a quiz calls `revalidateTag` for that user, and the cache also refreshes on its own every five minutes.

Slower parts of a page stream in with `<Suspense>`: a profile's recent quizzes and the home page's "Continue quiz" banner load separately, so the rest of the page shows straight away. The quiz, score, review and profile routes each have a `loading.tsx` skeleton shaped like the page it replaces.

For search engines and link previews, `robots.ts` keeps the API, quiz and settings pages out of search results, `sitemap.ts` lists the public pages, and `opengraph-image.tsx` generates the preview image with `next/og`. Profiles get their own title, description and canonical URL, and unknown usernames are marked `noindex`.

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
| `SITE_URL` | Optional. Public URL used in the sitemap and link previews; falls back to `NEXTAUTH_URL`, then the Vercel production URL |

## Testing

```bash
npm test
```

The suite runs in Node and jsdom and never touches the database or the trivia API. It covers:

- Scoring: correct, wrong and unanswered picks, out-of-range picks, and the time cap
- Validation schemas and the server-side countdown
- The submit and answers APIs: sign-in required, owner-only access, finished attempts, late saves, mismatched answers, double submits and finishing an attempt at its deadline
- The quiz player: answering and submitting, answering with the keyboard alone, saving picks as they're made, restoring them after a refresh, the retry message on a failed save, and auto-submit on timeout
- Dialogs: focus moves in and stays inside, Escape closes them, and focus returns to where it was
- Dropdowns: picking with the mouse or the keyboard alone, the selected option, closing on Escape or a click outside without a change, and sending the value with a form
- The login page: one-click sign-in with the test account, and the error shown when sign-in fails
- Sign-in sessions created before the switch to cuid ids are upgraded to the user's new id
- The profile Server Action: sign-in required, the test account kept read-only, validation messages that keep what was typed, and refreshing only that user's cached profile
- Profile caching: the cache tag, real dates on cache hits, and skipping the cache right after an expired quiz is finished

## Project structure

```
app/
  (main)/                 Pages with the navbar and footer
    quiz/[id]/            Quiz player, score and review pages
    user/[username]/      Public profiles
    settings/             Profile and quiz preferences
  (auth)/                 Login and sign-up, with a minimal layout
  api/                    Route handlers (quiz attempts, sign-up, profile)
  component/              Shared UI components
lib/                      Auth, Prisma, quiz logic and helpers
prisma/                   Schema and migrations
middleware.ts             Route protection
```

## Known limitations

- Expired attempts are finished when they're next loaded rather than at the deadline itself. An attempt that is never opened again stays in progress until a scheduled job is added to sweep them
- Quizzes without a time limit stay open until they're submitted
- Profile changes that don't go through the app's own actions, such as a new GitHub avatar, can take up to five minutes to show on the cached profile
- Async server components aren't covered by the unit tests; end-to-end tests with Playwright would be the next step
