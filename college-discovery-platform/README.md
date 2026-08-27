# College Discovery Platform

A production-oriented college discovery and decision-making MVP built with Next.js, TypeScript, TailwindCSS, Prisma, and PostgreSQL.

## Project Overview

The College Discovery Platform is designed to help students evaluate and compare engineering and technology institutions in India. By focusing on data-driven metrics—like annual fees, historical placement records, and past admission cutoffs—the application provides a serious decision-making tool tailored for students and parents.

The current MVP focuses on four core experiences:
1. **College Discovery**
2. **College Detail**
3. **College Comparison**
4. **College Predictor**

*Note: The Predictor feature acts purely as a reference tool based on historical cutoff data. It is not a machine-learning probability engine and does not guarantee future admission.*

---

## Features

**1. College Discovery**
- Search by college name or location.
- Rich filtering (state, city, fees, rating).
- Sort by rating, fees, or alphabetical order.
- Fast, URL-driven pagination.
- Fully responsive UI with specialized mobile modal filters.

**2. College Detail**
- Clean overview of institutional stats.
- Responsive data grid for course offerings and annual fees.
- Placement history highlighting highest and median packages.
- Review list with standardized date formatting.
- Historical cutoffs categorized by exam and admission year.

**3. College Comparison**
- Side-by-side metric comparison of 2–3 colleges.
- Neutral, automated visual highlighting (e.g., green indicators for "Highest Placement" and "Lower Cost").
- Interactive "Remove" logic that keeps the URL as the single source of truth.

**4. College Predictor**
- User input for Exam, Category, and Rank.
- Real-time Zod validation preventing invalid/decimal/negative ranks.
- Match engine pulling from historical cutoff records.
- Dedicated recommendation cards displaying exactly *why* a college matched (Your Rank vs. Historical Cutoff).

---

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React
- TypeScript
- TailwindCSS

**Backend:**
- Next.js API Routes (Serverless)
- TypeScript
- Prisma ORM

**Database & Validation:**
- PostgreSQL (Hosted via Neon)
- Zod (Schema parsing and strict type-safety)

---

## Architecture

```text
       User
         ↓
 Next.js App Router (Client UI)
         ↓
 Next.js API Routes (Server)
         ↓
  Zod Validation
         ↓
    Prisma ORM
         ↓
 Neon PostgreSQL
```

- **Server Components:** Utilized heavily to push heavy HTML rendering and SEO (`generateMetadata`) to the server, keeping the client JavaScript bundle minimal.
- **Client Components:** Constrained strictly to interactive pieces (like debounced search forms, `useState` inputs, and local storage hooks).
- **URL-driven State:** Core application states (discovery filters, comparison selections) rely primarily on URL Search Parameters instead of heavy state-management libraries (like Redux). This enables users to copy/paste and share exact filtered views.
- **Shared Local State:** Used standard browser `localStorage` synced with a React hook (`useCompareState`) to manage the "Compare Bar" limits without server round-trips.

---

## Database

The relational database is orchestrated strictly through Prisma.

**Key Models:**
- `College` - Institutional entity (UUID). Uses enums for type (GOVERNMENT, PRIVATE).
- `Course` - Degree programs mapped to colleges. Uses `Decimal` types for safe, precise monetary values (Annual Fees).
- `Placement` - Historical outcomes. Enforces a `@@unique([collegeId, year])` constraint to prevent duplicate data points.
- `Review` - User feedback.
- `ExamCutoff` - The core of the predictor. Uses composite indexing `@@index([exam, category, closingRank])` to ensure high-speed querying on large tables.

---

## API Documentation

The backend adheres to standard REST-like principles using Next.js Route Handlers. Internal database errors are masked; validation errors return safe `400` codes, and missing resources return `404`.

**1. `GET /api/colleges`**
- **Purpose:** Retrieves a paginated list of colleges matching filter criteria.
- **Query Params:** `search`, `state`, `city`, `minFees`, `maxFees`, `minRating`, `sort`, `page`, `limit`.
- **Response:** `{ data: College[], meta: { count, page, totalPages } }`

**2. `GET /api/colleges/[slug]`**
- **Purpose:** Retrieves exhaustive detail payload for a single institution.
- **Example:** `/api/colleges/iit-bombay`
- **Response:** `{ data: { ...college, courses, placements, cutoffs, reviews } }`

**3. `GET /api/colleges/compare?slugs=...`**
- **Purpose:** Fetches lightweight comparison data for 2 to 3 colleges.
- **Example:** `/api/colleges/compare?slugs=iit-bombay,iit-delhi`
- **Response:** `{ data: College[] }`

**4. `POST /api/predictor`**
- **Purpose:** Identifies historical cutoff matches against a student's rank.
- **Body:** `{ "exam": "JEE_ADVANCED", "category": "GENERAL", "rank": 50 }`
- **Response:** `{ data: Match[] }`

---

## Predictor Methodology

The College Predictor is explicitly **not an ML model**. 

It deterministically queries the `ExamCutoff` table.
1. The student's rank is compared against historical `closingRank`.
2. A match is defined as: `student rank <= historical closing rank`.
3. Matches are grouped by college. The algorithm prefers the closest numerical match and, where applicable, prioritizes the most recent admission year.
4. Final results are ordered by closest rank distance, then college rating.

*Disclaimer: Historical matches do not guarantee future admission. Cutoff trends shift annually.*

---

## Engineering Decisions

- **Why PostgreSQL & Neon?** Relational data mapping is crucial for hierarchical data (Colleges -> Courses -> Cutoffs). Neon provides instantaneous serverless scaling that pairs perfectly with Vercel deployment.
- **Why Prisma?** Guarantees end-to-end type safety. Updating a Prisma schema automatically reflects TS compiler errors if UI components break, eliminating hidden runtime bugs.
- **Why Zod?** Defensive programming. By asserting types at the API boundary before hitting Prisma, we safely prevent malicious injection and handle edge cases (like decimal inputs on rank fields).
- **Why UUIDs?** Prevents enumeration attacks (e.g., `/colleges/1`, `/colleges/2`) and simplifies database merging.
- **Why Decimal?** JS floating-point math causes precision errors (`0.1 + 0.2`). Storing currency as Postgres Decimals ensures absolute fidelity.
- **Why no Redux?** The Next.js App router handles data caching inherently. Global state management libraries add unnecessary boilerplate when the URL search parameters can serve as the primary source of truth.

---

## Performance

- **Server-Side Pagination:** The database uses `take` and `skip` heavily. We never load 1,000 rows into the browser's memory.
- **Debounced Inputs:** Search bars fire `fetch` commands only 400ms after the user stops typing, saving hundreds of unnecessary network round trips.
- **Selective Prisma Fields:** Queries utilize `select` objects to pull only required strings, ignoring heavy relational arrays when rendering simple cards.

---

## Security

- All database connection strings are confined to `process.env`.
- `.env` files are strictly excluded via `.gitignore`.
- Next.js API Routes serve as middle-men, completely hiding the Prisma Database layer from the browser network tab.
- API errors are sanitized; stack traces and SQL injection hints are never returned in `500` status JSON.

---

## Local Development

To run this repository locally:

1. Clone the repository and install dependencies:
   ```bash
   git clone <repository>
   cd college-discovery-platform
   npm install
   ```

2. Create a local `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```
   *Replace the `DATABASE_URL` inside `.env` with a valid Neon or local PostgreSQL connection string.*

3. Generate the Prisma client, migrate the schema, and seed the demo dataset:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run prisma:seed
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

Navigate to `http://localhost:3000`.

---

## Limitations

- **Demo Dataset:** Current colleges and cutoff values are heavily simulated for development purposes and may not reflect real-world values for the 2026 academic year.
- **Substring Search:** Searching relies on Prisma's `contains`. At 1,000,000+ rows, this would bottleneck and require native Postgres trigram indexes or a dedicated engine (like ElasticSearch).
- **Authentication:** The MVP does not currently feature login, registration, or "Saved Colleges".

---

## Future Improvements

- OAuth Authentication (Google/GitHub).
- "Save College to Dashboard" functionality.
- Enhanced analytics and multi-year cutoff progression graphs.
- PostgreSQL full-text/trigram indexing for blazing-fast typo-tolerant search.

---

## Submission Checklist

- [x] Production build passes
- [x] Environment variables configured
- [ ] GitHub repository
- [ ] Live deployment
- [ ] Loom walkthrough
- [ ] Google Form submitted
