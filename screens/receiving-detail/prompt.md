# Receiving Record — implementation prompt

![mockup](desktop.png)

## Business context
- **Cluster:** Inbound & Inventory (Phase 2)
- **Purpose:** Register road/rail BOL receipts, project units into inventory, search and track lifecycle.
- **Actor:** Control Office Operator, Yard Operator
- **Workflow position:** `road/rail-receipt-form → receiving-detail → inventory-search → product-unit-detail`
- **Follows:** order-intake
- **Precedes:** vessel-release

### Related screens in this cluster
- [Receiving Records](../receiving-list/prompt.md) (`/yard-flow/receiving`)
- [Road Receipt (BOL)](../road-receipt-form/prompt.md) (`/yard-flow/receiving/road/new`)
- [Rail Receipt (BOL)](../rail-receipt-form/prompt.md) (`/yard-flow/receiving/rail/new`)
- [Inventory Search](../inventory-search/prompt.md) (`/yard-flow/inventory`)
- [Product Unit](../product-unit-detail/prompt.md) (`/yard-flow/inventory/[id]`)
- [Item Summary](../item-summary/prompt.md) (`/yard-flow/inventory/item-summary`)

## Goal
Receiving Record screen in the **Inbound & Inventory** cluster. Used by Control Office Operator, Yard Operator.

## Route & placement
- Route: `/yard-flow/receiving/[id]`
- Sidebar: Yard Flow (L1 rail) → Inbound & Inventory (L2 cluster) → route cluster → Receiving Record (L4)
- Breadcrumb: Yard Flow / Receiving / Receiving Record
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_RECEIVING_BASE_URL` = `${BASE_URL}/api/receiving/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/records/{id}` | Receiving Record action | — | — |
| `POST` | `/records/{id}/corrections` | Receiving Record action | — | — |
| `POST` | `/records/{id}/cancel` | Receiving Record action | — | — |
| `POST` | `/records/{id}/approve-discrepancy` | Receiving Record action | — | — |
| `POST` | `/records/{id}/downstream-use` | Receiving Record action | — | — |
- Auth: mutations require `actor` field. Permissions: receiving.write, receiving.discrepancy.approve.


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/receiving-detail/get-receiving-detail.dto.ts`
- `src/lib/types/yard-flow/request/receiving-detail/create-receiving-detail-request.dto.ts`


## UI spec
- Component pattern: **Detail view + actions**


- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/receiving-detailSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/inbound-inventory/receiving-detail/`
- `src/services/yard-flow/receivingService.ts`
- `src/hooks/yard-flow/useReceivingRecordMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_RECEIVING_BASE_URL = `${BASE_URL}/api/receiving/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Screen actions trigger correct endpoints
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
