# AI Prompt Engineering & Iteration Log

## System Setup & Tooling
- Stack: Vite + React, Tailwind CSS, Zod, React Hook Form, Vitest.
- AI Assistant: Structured iterative prompt guidance.

## Task 1 Iterations (Profile Settings Form)
- Defined schema rules: Display Name requirement (2-50 chars), phone number regex validation, URL scheme enforcement (`http://` or `https://`), and bio 160-char length limit.
- Implemented accessible field controls using `aria-invalid` and `aria-describedby` linked to inline error messages.
- Built real-time dynamic error clearing on field input change/blur.