# Developer Prompts

This log records the prompts used during development, including the initial setup, task implementations, testing, and layout polish.

---

## 1. Project Setup, Tech Stack & Folder Structure

> I am working on the Entrata AI Coding Challenge using React 19, Vite, Tailwind CSS v4, Lucide React icons, and Vitest.
> Set up the workspace following this folder structure:
> 
> Under src, create a task1 folder containing ProfileForm.jsx, ProfileForm.test.jsx, and validation.js.
> Create a task2 folder containing CacheDemo.jsx, fetchLayer.js, and fetchLayer.test.jsx.
> At the src root, we have App.jsx, index.css, main.jsx, and setupTests.js.

---

## 2. Task 1: Form Validation Rules

> Inside validation.js under task1, create the form validation rules:
> Display name: required, minimum 2 characters.
> Website URL: optional, but must start with http:// or https://
> Bio: optional, with a 160 character maximum limit.

---

## 3. Task 1: Profile Form Component

> Now build ProfileForm.jsx in task1 using React Hook Form to connect our validation rules. Display red error messages with icons under invalid fields, handle accessibility attributes like aria-invalid, keep the Save button disabled when the form has errors, and show a green success box at the top when submitted.

---

## 4. Task 1: Unit Testing

> Write unit tests in ProfileForm.test.jsx using Vitest to check that:
> 1. The Save button stays disabled when required fields are empty.
> 2. Typing example.com shows the URL error message.
> 3. Fixing it to https://example.com removes the error.
> 4. Filling valid inputs enables the button and submitting displays the success message.

---

## 5. Task 2: Query Cache Engine

> For Task 2, create a cache class in fetchLayer.js inside task2 to prevent stale data fetches:
> Write a method that sorts filter parameters alphabetically so page 1 and filter active generates the exact same cache key even if parameters are passed in a different order.
> Add a time-limit check so old cached data expires.
> Add an invalidation method to clear matching cache entries whenever data is added or updated.

---

## 6. Task 2: Cache Demo UI & Tests

> Build CacheDemo.jsx using Tailwind CSS to showcase the cache visually. Include buttons to fetch filtered users and trigger a data update, alongside a dark log box displaying color-coded messages for cache hits, cache misses, and updates.
> 
> Also write unit tests in fetchLayer.test.jsx verifying that different filter parameters generate separate cache entries and mutations clear old data.

---

## 7. App Layout & Polish

> Update App.jsx to wrap everything in a clean tab menu with icons so we can switch back and forth between Task 1 (Profile Form) and Task 2 (Cache Demo).