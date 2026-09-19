# Task 7 Rerun 005 — API Keys Management

**Status:** READY FOR FRESH AGENT  
**Task:** `dse.ai-eval.api-keys-management`  
**Purpose:** prove Task 7 guidance clarification A1 resolves the prior ambiguity without exposing evaluator-only expectations  
**Evaluation branch:** `ai-eval/api-keys-rerun-005`  
**Verified Task 7 baseline:** `4f51b6a40bdc81161b5f065eb2f01d3e325595a2`  
**Baseline CI:** run 570 — PASS  
**Bootstrap HEAD:** `c07302a296aa8e03ee513173dce0747d4ec94925`

## Blindness rule

The orchestration chat has seen Task 6 evaluator expectations and must not implement the rerun.

The fresh coding agent receives only the safe task projection and the approved repository allowlist. Full task JSON and evaluator-only content remain denied.

## What changed since Run 002

The agent-visible canonical policy now includes `uncertainty.evaluation-placeholder`.

This record does not restate evaluator success criteria; the fresh agent must derive behavior from approved machine-readable authority.

## Completion evidence

After the fresh run:

- record agent/model;
- capture final SHA;
- verify write-root-only changes;
- verify no denied-source/evaluator contamination;
- capture tests/typecheck/Storybook/browser evidence;
- compare the prior A1 ambiguity against the new run without human correction.

Do not start the Team rerun until this run is captured.
