# Field: Vessel Receipt — implementation prompt

![mockup](desktop.png)
![mobile](mobile.png)

## Business context
- **Cluster:** Loading Pipeline (Phase 6)
- **Purpose:** Depot tally receipt → Bijak issue/print → gate exit → vessel receipt confirmation.
- **Actor:** Depot Tallyman, Control Office, Warehouse Guard, Vessel Tallyman
- **Workflow position:** `depot-tally-issue → bijak-new → bijak-workspace (issue/print) → gate-lookup/gate-mobile → vessel-tally-mobile → vessel-tally-detail`
- **Follows:** fleet-management
- **Precedes:** close-out

### Related screens in this cluster
- [Depot Tally Receipts](../depot-tally-list/prompt.md) (`/yard-flow/loading/depot-tally`)
- [Issue Depot Receipt](../depot-tally-issue/prompt.md) (`/yard-flow/loading/depot-tally/new`)
- [Depot Receipt](../depot-tally-detail/prompt.md) (`/yard-flow/loading/depot-tally/[id]`)
- [Field: Issue Receipt](../depot-tally-mobile/prompt.md) (`mobile`)
- [Bijaks](../bijak-list/prompt.md) (`/yard-flow/loading/bijak`)
- [Bijak](../bijak-workspace/prompt.md) (`/yard-flow/loading/bijak/[id]`)
- [New Bijak](../bijak-new/prompt.md) (`/yard-flow/loading/bijak/new`)
- [Print Copies](../bijak-print/prompt.md) (`/yard-flow/loading/bijak/[id]/print`)
- [Gate Exits](../gate-exits-list/prompt.md) (`/yard-flow/loading/gate`)
- [Gate Exit](../gate-detail/prompt.md) (`/yard-flow/loading/gate/[id]`)
- [Gate Lookup & Confirm](../gate-lookup/prompt.md) (`/yard-flow/loading/gate/lookup`)
- [Field: Gate Confirm](../gate-mobile/prompt.md) (`mobile`)
- [Vessel Receipts](../vessel-tally-list/prompt.md) (`/yard-flow/loading/vessel-tally`)
- [Vessel Receipt](../vessel-tally-detail/prompt.md) (`/yard-flow/loading/vessel-tally/[id]`)

## Goal
Field: Vessel Receipt screen in the **Loading Pipeline** cluster. Used by Depot Tallyman, Control Office, Warehouse Guard, Vessel Tallyman.

## Route & placement
- Route: `(mobile handheld)`
- Sidebar: Yard Flow (L1 rail) → Loading & Exit (L2 cluster) → route cluster → Field: Vessel Receipt (L4)
- Breadcrumb: Yard Flow / Loading / Field: Vessel Receipt
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_VESSELTALLY_BASE_URL` = `${BASE_URL}/api/vesseltally/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/receipts/lookup` | Field: Vessel Receipt action | — | — |
| `POST` | `/receipts` | Field: Vessel Receipt action | — | — |
- Auth: mutations require `actor` field. Permissions: .


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/vessel-tally-mobile/get-vessel-tally-mobile.dto.ts`
- `src/lib/types/yard-flow/request/vessel-tally-mobile/create-vessel-tally-mobile-request.dto.ts`


## UI spec
- Component pattern: **Mobile handheld layout**


- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/vessel-tally-mobileSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/loading-pipeline/vessel-tally-mobile/`
- `src/services/yard-flow/vesseltallyService.ts`
- `src/hooks/yard-flow/useField:VesselReceiptMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_VESSELTALLY_BASE_URL = `${BASE_URL}/api/vesseltally/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Screen actions trigger correct endpoints
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
