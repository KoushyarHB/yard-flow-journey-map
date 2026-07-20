# Field: Claim / Scan — implementation prompt

![mockup](desktop.png)
![mobile](mobile.png)

## Business context
- **Cluster:** Yard Operations (Phase 4)
- **Purpose:** Select product units from yard, physically verify, apply color marks, convert to release.
- **Actor:** Yard Operator, Yard Shift Supervisor
- **Workflow position:** `selectable-products → yard-selection-workspace (claim → verify → mark) → convert-to-release`
- **Follows:** vessel-release
- **Precedes:** fleet-management

### Related screens in this cluster
- [Yard Selections](../yard-selections-list/prompt.md) (`/yard-flow/yard-selection`)
- [Selection Workspace](../yard-selection-workspace/prompt.md) (`/yard-flow/yard-selection/[id]`)
- [Selectable Products](../selectable-products/prompt.md) (`/yard-flow/yard-selection/selectable`)
- [Field: Verify](../yard-selection-mobile-verify/prompt.md) (`mobile`)
- [Field: Color Marking](../yard-selection-mobile-mark/prompt.md) (`mobile`)

## Goal
Field: Claim / Scan screen in the **Yard Operations** cluster. Used by Yard Operator, Yard Shift Supervisor.

## Route & placement
- Route: `(mobile handheld)`
- Sidebar: Yard Flow (L1 rail) → Yard Operations (L2 cluster) → route cluster → Field: Claim / Scan (L4)
- Breadcrumb: Yard Flow / Yard Selection / Field: Claim / Scan
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_YARDSELECTION_BASE_URL` = `${BASE_URL}/api/yardselection/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `POST` | `/yard-selections/{id}/lines` | Field: Claim / Scan action | — | — |
- Auth: mutations require `actor` field. Permissions: .
- Note: Handheld: scan product ID, add to selection.

## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/yard-selection-mobile-claim/get-yard-selection-mobile-claim.dto.ts`
- `src/lib/types/yard-flow/request/yard-selection-mobile-claim/create-yard-selection-mobile-claim-request.dto.ts`


## UI spec
- Component pattern: **Mobile handheld layout**


- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/yard-selection-mobile-claimSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/yard-operations/yard-selection-mobile-claim/`
- `src/services/yard-flow/yardselectionService.ts`
- `src/hooks/yard-flow/useField:Claim/ScanMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_YARDSELECTION_BASE_URL = `${BASE_URL}/api/yardselection/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Screen actions trigger correct endpoints
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
