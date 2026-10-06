---
description: Run a feature build through the 3-phase workflow (research → plan/build → test/review) with HARD GATEs between phases.
argument-hint: <feature description>
---

# /feature — Phased Feature Build Orchestrator

Build the feature below by running the three workflow phases **in order**, enforcing the
HARD GATE between each. Read the phase file at each boundary and follow it exactly.

**Feature:** $ARGUMENTS

---

## Run order (gates are non-negotiable)

| Phase | File | Gate before advancing |
|-------|------|-----------------------|
| 1 · Research | `.claude/workflows/01-research.md` | Research note exists (sources + version-verified verdict). No assumptions without sources. |
| 2 · Plan & Build | `.claude/workflows/02-plan-build.md` | **Design approved by user** (brainstorming). STYLED.md read before UI. No code before approval. |
| 3 · Test & Review | `.claude/workflows/03-test-review.md` | `npm run build && npm run lint` pass → E2E green → review chain clean. |

## Rules

1. **Do not skip a phase.** Read each `NN-*.md` at its boundary, not from memory.
2. **Gate failures loop back**, never forward — review finds P1/P2 → return to Phase 2.
3. **Git stays gated** — commit/push only on explicit user go-ahead.
4. If `$ARGUMENTS` is empty, ask the user what feature to build before starting Phase 1.
5. Honor session defaults: `/caveman lite`, file line limits, worktree-first.

Begin with **Phase 1**.
