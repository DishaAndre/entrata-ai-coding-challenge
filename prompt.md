# Entrata AI Coding Challenge - Prompt Requirements

## Overview
This document logs the core prompt specifications, technical requirements, and target behaviors implemented across both challenge tasks.

---

## Task 1: Profile Settings Form

### Objectives
* Build a responsive React form to capture user profile settings: `displayName`, `phone`, `website`, and `bio`.
* Provide accessible, clear, and immediate feedback using proper ARIA attributes (`aria-invalid`, `aria-describedby`).

### Validation Rules
* **Display Name:** Required field. Must not be empty.
* **Website URL:** Optional field. If provided, must strictly include an explicit scheme (`http://` or `https://`).
* **Phone Number:** Optional field. If provided, must include a valid international country code pattern (e.g., `+11234567890`).
* **Bio:** Character limit capped at `160` characters.

### UX Requirements
* Display specific inline errors near the failing input field upon blur/change.
* Disable the primary submit button until all required fields are valid.
* Retain valid data on partial validation failures.
* Trigger a clear success notification banner/toast upon valid submission.

---

## Task 2: Cache Stale Reads & Mutation Invalidation

### Objectives
* Implement a client-side data-fetching cache layer to resolve stale reads and cross-query state leakage.

### System Requirements
* **Parameter-Aware Key Generation:** Generate deterministic, unique cache keys using normalized query parameters to prevent returning cached generic responses when filtering inputs.
* **Expiration Handling:** Apply a Time-To-Live (TTL) mechanism to assess stale entries.
* **Mutation Invalidation:** Automatically invalidate matching cached query entries whenever a POST, PUT, or DELETE mutation is executed.
* **Observability:** Render an interactive UI (`CacheDemo.jsx`) logging `CACHE HIT`, `CACHE MISS`, and `MUTATION` events with precise timestamps for manual verification.