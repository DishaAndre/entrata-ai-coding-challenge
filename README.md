
# Entrata AI Coding Challenge

A full-stack React application demonstrating robust client-side form validation, accessible UX patterns, and a query cache layer with mutation invalidation to prevent stale reads.

---

## Tech Stack

- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest, React Testing Library, `@testing-library/jest-dom`
- **Language:** JavaScript (ES6+)

---

## Problem Statements & Solutions

### Task 1: Profile Settings Form

**Problem:**

Users face unhelpful errors, disabled states without feedback, or loss of form data when validating inputs like URL schemes, phone numbers, and display names.

**Solution:**

- Implemented controlled form inputs with instant inline validation on change and blur.
- Added precise regex checking for website URLs, requiring explicit `http://` or `https://` schemes.
- Provided accessible field labeling using `aria-invalid` and `aria-describedby`.
- Added live feedback via a status banner/toast.
- Kept valid form data intact upon partial validation failures.

### Task 2: Cache Stale Reads & Mutation Invalidation

**Problem:**

Standard client-side caching memoizes responses purely by base URL, leading to cross-user data leakage, stale reads on parameter-filtered queries, and out-of-date UI states following POST/PUT mutations.

**Solution:**

- Built a parameter-aware `QueryCache` engine that generates unique deterministic cache keys combining base endpoints and sorted query parameters.
- Integrated TTL-based cache expiry alongside explicit mutation invalidation triggers using `cache.invalidate(endpoint)`.
- Created an interactive `CacheDemo` visualizer to monitor real-time `CACHE HIT`, `CACHE MISS`, and `MUTATION` logs.

---

## Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/DishaAndre/entrata-ai-coding-challenge.git
cd entrata-ai-coding-challenge
npm install
````

### 2. Development Server

Run the Vite development server to launch the interactive UI:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Running Unit Tests

Execute the Vitest test suite:

```bash
npx vitest run
```

---

## Test Coverage

### Task 1 — `src/task1/ProfileForm.test.jsx`

* Ensures the submit button remains disabled when required fields are empty.
* Validates the URL scheme requirement inline.
* Verifies error clearing after fixing invalid fields.
* Tests successful submission toast notification.

### Task 2 — `src/task2/fetchLayer.test.jsx`

* Verifies query parameter key isolation.
* Validates instant cache entry invalidation upon data mutations.

---

## Project Structure

```text
src/
├── task1/
│   ├── ProfileForm.jsx
│   └── ProfileForm.test.jsx
├── task2/
│   ├── fetchLayer.js
│   ├── CacheDemo.jsx
│   └── fetchLayer.test.jsx
├── App.jsx
├── main.jsx
└── setupTests.js
```
---

## Trade-offs & Future Work

### Trade-offs
* **In-Memory Cache vs. Persistent Storage:** The current caching layer relies on in-memory storage, which clears upon page refreshes. This choice prioritizes simple client-side performance for single sessions over offline persistence.
* **Simplistic Regex Phone Parsing:** Phone validation enforces basic country-code formatting without forcing specific country dropdowns. This keeps form submission friction minimal while meeting core validation specs.

### Future Work
* **Persistent Cache Storage:** Expand the custom cache layer to sync with `localStorage` or `IndexedDB` to retain query hits across full browser reloads.
* **Advanced Phone Input Parsing:** Integrate an international phone library (such as `libphonenumber-js`) for dynamic flag selection and localized format validation.