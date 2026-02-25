# Interview Task Backlog

Use these tickets as guided debugging prompts.

## Board Snapshot

| Ticket | Type | Priority | Area | Summary | Status |
|---|---|---|---|---|---|
| INT-101 | Bug | P1 | Express | Users list fails to load | OPEN |
| INT-102 | Bug | P1 | Express | Delete endpoint doesn't persist | OPEN |
| INT-103 | Bug | P1 | Express | Task query is unsafe | OPEN |
| INT-104 | Bug | P1 | Frontend | Stats and analytics lag behind task changes | OPEN |
| INT-105 | Bug | P2 | Frontend | Notes drift to wrong task | OPEN |
| INT-106 | Bug | P2 | Frontend | Auto-refresh targets stale data | OPEN |
| INT-107 | Bug | P2 | Frontend | Status toggle feels unresponsive | OPEN |
| INT-108 | Bug | P3 | Frontend | Completion percentage is wrong | OPEN |

---

## INT-101 — Users list fails to load
- **Type:** Bug | **Priority:** P1
- **Symptoms:** App shows failure state on startup. Check the network tab.
- **Done when:** Users dropdown populates correctly.

## INT-102 — Delete endpoint doesn't persist
- **Type:** Bug | **Priority:** P1
- **Symptoms:** Deleting a task appears to succeed, but the task reappears on refresh.
- **Done when:** Deleted tasks stay deleted.

## INT-103 — Task query is unsafe
- **Type:** Bug | **Priority:** P1
- **Symptoms:** Review how the task listing query is constructed.
- **Done when:** Query parameters are handled safely.

## INT-104 — Stats and analytics lag behind task changes
- **Type:** Bug | **Priority:** P1
- **Symptoms:** After toggling a task's status or deleting a task, the stat cards and analytics section still show old values.
- **Done when:** All data sections update after any mutation.

## INT-105 — Notes drift to wrong task
- **Type:** Bug | **Priority:** P2
- **Symptoms:** Type a note on a task, then delete a task above it in the list.
- **Done when:** Notes stay with the task you typed them on.

## INT-106 — Auto-refresh targets stale data
- **Type:** Bug | **Priority:** P2
- **Symptoms:** Switch users and watch the console over time.
- **Done when:** Auto-refresh always reflects the current selection.

## INT-107 — Status toggle feels unresponsive
- **Type:** Bug | **Priority:** P2
- **Symptoms:** Clicking "Complete" or "Reopen" doesn't update the UI until the server responds. The optimistic update appears to have no effect.
- **Done when:** The task status updates in the UI immediately on click, before the server round-trip.

## INT-108 — Completion percentage is wrong
- **Type:** Bug | **Priority:** P3
- **Symptoms:** The analytics completion rate doesn't match what you'd expect from the task counts.
- **Done when:** The displayed percentage is correct.
