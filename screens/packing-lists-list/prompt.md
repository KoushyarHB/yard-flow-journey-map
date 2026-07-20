# Packing Lists — implementation prompt

![mockup](desktop.png)

## Business context
- **Cluster:** Order Intake (Phase 1)
- **Purpose:** Register export orders, import packing lists, reconcile against expected cargo.
- **Actor:** Order Operator
- **Workflow position:** `orders-list → order-form → order-detail → packing-list-reconcile → confirm`
- **Follows:** overview, administration
- **Precedes:** inbound-inventory

### Related screens in this cluster
- [Orders](../orders-list/prompt.md) (`/yard-flow/orders`)
- [Order Detail](../order-detail/prompt.md) (`/yard-flow/orders/[id]`)
- [New Order](../order-form/prompt.md) (`/yard-flow/orders/new`)
- [Packing List Reconciliation](../packing-list-reconcile/prompt.md) (`/yard-flow/orders/[id]/packing-list`)

## Goal
Packing Lists screen in the **Order Intake** cluster. Used by Order Operator.

## Route & placement
- Route: `/yard-flow/orders/packing-lists`
- Sidebar: Yard Flow (L1 rail) → Order Intake (L2 cluster) → route cluster → Packing Lists (L4)
- Breadcrumb: Yard Flow / Orders / Packing Lists
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_ORDERCONFIRMATION_BASE_URL` = `${BASE_URL}/api/orderconfirmation/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/orders/{id}/packing-list` | Packing Lists action | — | — |
| `POST` | `/orders/{id}/packing-lists` | Packing Lists action | — | — |
- Auth: mutations require `actor` field. Permissions: packinglist.approve.


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/packing-lists-list/get-packing-lists-list.dto.ts`
- `src/lib/types/yard-flow/request/packing-lists-list/create-packing-lists-list-request.dto.ts`
- Enums: `src/lib/enums/yard-flow/orderconfirmation-status.enum.ts` — values: Parsed, Confirmed, Superseded

## UI spec
- Component pattern: **GenericTable**
### Columns
- **Order No** (`orderNo`) — filter: text
- **Status** (`status`) — filter: text, status badge
- **Uploaded** (`date`) — filter: text

- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/packing-lists-listSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/order-intake/packing-lists-list/`
- `src/services/yard-flow/orderconfirmationService.ts`
- `src/hooks/yard-flow/usePackingListsMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_ORDERCONFIRMATION_BASE_URL = `${BASE_URL}/api/orderconfirmation/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Grid columns, filters, pagination match spec
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
