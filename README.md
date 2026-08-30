# PhotoShare (frontend)

Photo-sharing web app I built in **mid 2024** to learn React, TypeScript, and how a frontend is structured (routes, context, forms, API calls).

Auth, an explore feed, create/edit/delete posts, and user profiles. Talks to a REST API at `http://localhost:5000`.

## Stack

React 18 · TypeScript · Vite · Material UI · React Router · TanStack Query · React Hook Form · Zod · JWT (cookies)

## Layout

```
src/
  components/   pages and UI
  context/      login + modal state
  query/        API hooks
  schema/       Zod validation
  types/        TypeScript types
```

## Run

Needs the backend running on port 5000.

```bash
npm install
npm run dev
```
