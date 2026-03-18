# Product Catalog — Vue.js

A catalog page built with Vue 3 and TypeScript, fetching live product data
from the DummyJSON API.

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Vite
- Vue Router

## Getting Started
npm install
npm run dev

Runs on `http://localhost:5173`

## Features

- Product grid fetched from the DummyJSON API
- Category filter — categories fetched from a dedicated API endpoint,
  filtered server-side with correct pagination per category
- Keyword search — debounced (400ms), uses the API search endpoint
  rather than client-side filtering
- Windowed pagination with first/last page navigation
- Skeleton loading state
- Empty state for no results
- Responsive layout

## Design Decisions

**API-driven filtering over client-side filtering**
Categories and search are handled via separate API endpoints rather than
filtering the current page locally - this ensures pagination works correctly
across the full dataset, not just the current 12 products.

**Debounced search**
Search fires after 400ms of inactivity

**Search and category are mutually exclusive**
Selecting a category clears the search query and vice versa.

**Keyword search replaces Sort By**
The Figma showed a Sort By button.
Since the requirements asked for keyword search, the Sort By
slot was repurposed for the search input.

**`fetchFromUrl` abstraction**
All three fetch functions (all products, by category, by search) share
identical loading/error/data logic. This was extracted into a single
`fetchFromUrl` helper to avoid repetition.