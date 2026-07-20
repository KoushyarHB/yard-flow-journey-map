# Gate Lookup & Confirm — implementation prompt

![mockup](desktop.png)

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
- [Field: Gate Confirm](../gate-mobile/prompt.md) (`mobile`)
- [Vessel Receipts](../vessel-tally-list/prompt.md) (`/yard-flow/loading/vessel-tally`)
- [Vessel Receipt](../vessel-tally-detail/prompt.md) (`/yard-flow/loading/vessel-tally/[id]`)
- [Field: Vessel Receipt](../vessel-tally-mobile/prompt.md) (`mobile`)

## Goal
Gate Lookup & Confirm screen in the **Loading Pipeline** cluster. Used by Depot Tallyman, Control Office, Warehouse Guard, Vessel Tallyman.

## Route & placement
- Route: `/yard-flow/loading/gate/lookup`
- Sidebar: Yard Flow (L1 rail) → Loading & Exit (L2 cluster) → route cluster → Gate Lookup & Confirm (L4)
- Breadcrumb: Yard Flow / Loading / Gate Lookup & Confirm
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_GATECONTROL_BASE_URL` = `${BASE_URL}/api/gatecontrol/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/gate-exits/lookup` | Gate Lookup & Confirm action | — | — |
| `POST` | `/gate-exits/{lookup}/confirm` | Gate Lookup & Confirm action | — | — |
| `POST` | `/gate-exits/{lookup}/reject` | Gate Lookup & Confirm action | — | — |
- Auth: mutations require `actor` field. Permissions: .
- Note: Desktop gate security: lookup bijak by id/number/barcode/token.

## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/gate-lookup/get-gate-lookup.dto.ts`
- `src/lib/types/yard-flow/request/gate-lookup/create-gate-lookup-request.dto.ts`


## UI spec
- Component pattern: **Form + DynamicTable workspace**


- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/gate-lookupSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/loading-pipeline/gate-lookup/`
- `src/services/yard-flow/gatecontrolService.ts`
- `src/hooks/yard-flow/useGateLookup&ConfirmMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_GATECONTROL_BASE_URL = `${BASE_URL}/api/gatecontrol/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Screen actions trigger correct endpoints
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
