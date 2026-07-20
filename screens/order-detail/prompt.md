# Order Detail — implementation prompt

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
- [New Order](../order-form/prompt.md) (`/yard-flow/orders/new`)
- [Packing Lists](../packing-lists-list/prompt.md) (`/yard-flow/orders/packing-lists`)
- [Packing List Reconciliation](../packing-list-reconcile/prompt.md) (`/yard-flow/orders/[id]/packing-list`)

## Goal
Order Detail screen in the **Order Intake** cluster. Used by Order Operator.

## Route & placement
- Route: `/yard-flow/orders/[id]`
- Sidebar: Yard Flow (L1 rail) → Order Intake (L2 cluster) → route cluster → Order Detail (L4)
- Breadcrumb: Yard Flow / Orders / Order Detail
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_ORDERCONFIRMATION_BASE_URL` = `${BASE_URL}/api/orderconfirmation/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/orders/{id}` | Order Detail action | — | — |
| `POST` | `/orders/{id}/confirm` | Order Detail action | — | — |
| `POST` | `/orders/{id}/close` | Order Detail action | — | — |
| `POST` | `/orders/{id}/revisions` | Order Detail action | — | — |
- Auth: mutations require `actor` field. Permissions: orders.write.
- Note: Header KV, items table, attachments, revisions timeline; confirm/close/revise actions.

## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/order-detail/get-order-detail.dto.ts`
- `src/lib/types/yard-flow/request/order-detail/create-order-detail-request.dto.ts`


## UI spec
- Component pattern: **Detail view + actions**


- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/order-detailSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/order-intake/order-detail/`
- `src/services/yard-flow/orderconfirmationService.ts`
- `src/hooks/yard-flow/useOrderDetailMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_ORDERCONFIRMATION_BASE_URL = `${BASE_URL}/api/orderconfirmation/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Screen actions trigger correct endpoints
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
