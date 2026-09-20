# Task 7 Rerun 006 — API Keys Management

**Status:** READY FOR FRESH AGENT  
**Task:** `dse.ai-eval.api-keys-management`  
**Purpose:** prove both Task 7 clarifications now resolve A1 and A3 under the blind protocol  
**Evaluation branch:** `ai-eval/api-keys-rerun-006`  
**Verified baseline:** `f66213e74cb3e77a1db5b960e504f0475dc9f1c4`  
**Baseline CI:** run 574 — PASS  
**Bootstrap HEAD:** `e76eabd9582b792cf3fbf026ec5281e5df7b0458`

The fresh agent must remain blind to evaluator-only expectations and denied implementation source.

Run 006 exists because Run 005 resolved A1 but proved A3: Application Shell's approved contract lacked its public consumer API. The verified baseline now includes structured pattern `publicApi` metadata with the runtime export and props.

Team rerun remains blocked until Run 006 is captured.
