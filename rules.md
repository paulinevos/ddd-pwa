# Project Rules & Guidelines

> **Checklist: Always check this file before any coding or design decision.**

## General Checklist

* Review all rules and prompts below before starting any work.
* Ensure all code and design decisions fit the documented guidelines.
* Ask clarifying questions if anything is ambiguous or unclear—never assume.
* Update this file iteratively with findings, progress, and learnings as the project evolves.

## General Principles

* This file must be referenced for context before any prompt or code change.
* Always check if code/design fits our documented standards.
* If unsure or if a prompt is ambiguous, ask questions—do not make assumptions.
* Iteratively update this document with new findings, progress, and learnings.

---

## 1. Clarifying Requirements and Planning

* Given the following feature description, identify any ambiguous requirements and suggest questions to clarify them: `[paste feature description here]`.
* List the minimal set of changes needed to add `[feature]` to the current codebase without breaking existing functionality.
* Break down the implementation of `[feature or component]` into small, testable tasks. Provide a checklist.

## 2. Proposing and Evaluating Changes

* Suggest three possible ways to implement `[feature or mechanic]`. For each, list pros, cons, and possible side effects.
* If we add `[feature]`, what parts of the codebase are likely to be affected? List files, modules, and components.
* Before making changes, outline the steps to safely refactor `[component or module]` to support `[new requirement]`.

## 3. Writing and Refactoring Code

* Write a new React Native component for `[feature]` that follows atomic design principles. Keep it isolated from unrelated logic.
* Refactor the existing `[component/service]` to use hooks instead of classes. Describe each step and how to test for regressions.
* Add feature flags to `[component/feature]` so it can be enabled or disabled without affecting other functionality.

## 4. Dependency Management

* **Local Development:** Use `bun` as the package manager for local development. The `bun.lockb` file is the source of truth for dependencies.
  * To resolve inconsistencies, run: `rm -rf node_modules package-lock.json yarn.lock && bun install`.
* **Docker Environment:** The Docker setup uses `npm`, as defined in the `Dockerfile`. This does not affect local development.

## 5. Multiplayer and State Management

* Describe how to isolate all network operations (e.g., WebSocket, Firebase) into a single service module. Provide a sample outline.
* Suggest a strategy for handling simultaneous updates from multiple players to the game state. How can we prevent conflicts?
* Write middleware to ensure only a host can perform `[critical action]`. Include tests for both host and player roles.

## 6. Testing and Validation

* Generate test cases to verify that game state remains synchronized between host and players, even with network delays.
* Write a test scenario for transitioning a player to host. What edge cases should be considered?
* Simulate a network failure during a critical game phase. What should the app do to recover gracefully?

## 7. Documentation and Communication

* Update the architecture diagram to reflect the new `[feature/module]`. Use simple ASCII or markdown diagrams.
* Document the decision to use `[approach/technology]` for `[feature]`. List alternatives considered and reasons for rejection.
* Create an error classification table for network errors, including how each should be handled in the UI.

## 8. Iterative, Safe Development Practices

* For `[feature]`, break the work into micro-tasks. For each, specify the acceptance criteria and possible risks.
* After making changes to `[component]`, compare the new behavior to the original specification. List any deviations.
* Before merging, summarize the changes and list any manual tests or validations that should be performed.

---

## How to Use These Prompts

* Start every new feature or refactor with a clarification prompt.
* Use evaluation and planning prompts before writing or changing code.
* Request code in small, isolated increments, and always follow up with testing prompts.
* After each change, ask for documentation updates and a summary of what changed.

---

## Change log / Last Updated

* **2025-06-11:** Implemented a design token system in `theme/index.ts`. Configured path aliases `@/theme` in `tsconfig.json` and `babel.config.js`. Documented usage in `guide.md`.
* **2025-06-10:** Initial population with core rules, prompts, and meta-guidelines as per project requirements.
