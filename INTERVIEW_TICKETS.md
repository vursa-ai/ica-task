# Interview Task Backlog (JIRA-Style)

Use these tickets as guided debugging prompts. They are intentionally scoped and do not include full solutions.

## Board Snapshot

| Ticket | Type | Priority | Area | Summary | Status |
|---|---|---|---|---|---|
| INT-101 | Bug | P1 | API Contract | Users list fails to load | OPEN |
| INT-102 | Bug | P1 | Frontend Cache | Stats/analytics stale after mutations | OPEN |
| INT-103 | Bug | P2 | React Rendering | Notes move to wrong task after delete | OPEN |
| INT-104 | Bug | P2 | React Hooks | Auto-refresh invalidates wrong user tasks | OPEN |
| INT-105 | Bug | P1 | Backend Security | Task query uses unsafe SQL construction | OPEN |
| INT-106 | Bug | P1 | Backend Data | Delete endpoint reports success but data persists | OPEN |
| INT-107 | Bug | P2 | Search | Partial search does not return matches | OPEN |
| INT-108 | Bug | P3 | Analytics | Completion percentage appears too low | OPEN |
| INT-109 | Bug | P2 | Backend Performance | Task listing endpoint issues repeated DB queries | OPEN |

---

## INT-101 - Users list fails to load
- Type: `Bug`
- Priority: `P1`
- Area: `API Contract`
- Symptoms:
  - App shows user-load failure state.
  - Network request for users returns 404.
- Done when:
  - Users dropdown loads successfully from backend.

## INT-102 - Stats/analytics stale after mutations
- Type: `Bug`
- Priority: `P1`
- Area: `Frontend Cache`
- Symptoms:
  - Task row updates/deletes appear, but summary cards lag behind.
- Done when:
  - Task list, stats, and analytics update consistently after status changes/deletes.

## INT-103 - Notes move to wrong task after delete
- Type: `Bug`
- Priority: `P2`
- Area: `React Rendering`
- Symptoms:
  - Local note input appears to jump to a different task after list reorder/delete.
- Done when:
  - Notes remain attached to the same logical task after deletes.

## INT-104 - Auto-refresh invalidates wrong user tasks
- Type: `Bug`
- Priority: `P2`
- Area: `React Hooks`
- Symptoms:
  - After switching user, timed refresh still targets prior user.
- Done when:
  - Auto-refresh always targets currently selected user.

## INT-105 - Task query uses unsafe SQL construction
- Type: `Bug`
- Priority: `P1`
- Area: `Backend Security`

## INT-106 - Delete reports success but data persists
- Type: `Bug`
- Priority: `P1`
- Area: `Backend Data`
- Symptoms:
  - API returns success; record may still exist on subsequent fetch.
- Done when:
  - Delete is durable and response matches actual DB outcome.

## INT-107 - Partial search does not return matches
- Type: `Bug`
- Priority: `P2`
- Area: `Search`
- Symptoms:
  - Search behaves like exact match.
- Done when:
  - Partial terms match title/description as expected.

## INT-108 - Completion percentage appears too low
- Type: `Bug`
- Priority: `P3`
- Area: `Analytics`
- Symptoms:
  - Completion rate display looks scaled down.
- Done when:
  - Completion rate aligns with completed/total task ratio.

## INT-109 - Task listing endpoint issues slow
- Type: `Bug`
- Priority: `P2`
- Area: `Backend Performance`
- Symptoms:
  - Endpoint performs slow