# New Order — implementation prompt

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
- [Packing Lists](../packing-lists-list/prompt.md) (`/yard-flow/orders/packing-lists`)
- [Packing List Reconciliation](../packing-list-reconcile/prompt.md) (`/yard-flow/orders/[id]/packing-list`)

## Goal
New Order screen in the **Order Intake** cluster. Used by Order Operator.

## Route & placement
- Route: `/yard-flow/orders/new`
- Sidebar: Yard Flow (L1 rail) → Order Intake (L2 cluster) → route cluster → New Order (L4)
- Breadcrumb: Yard Flow / Orders / New Order
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_ORDERCONFIRMATION_BASE_URL` = `${BASE_URL}/api/orderconfirmation/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `POST` | `/orders` | New Order action | — | — |
| `PATCH` | `via POST /orders/{id}/revisions` | New Order action | — | — |
- Auth: mutations require `actor` field. Permissions: .
- Note: Header + items DynamicTable + attachments.

## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/order-form/get-order-form.dto.ts`
- `src/lib/types/yard-flow/request/order-form/create-order-form-request.dto.ts`


## UI spec
- Component pattern: **react-hook-form + Zod**

### Form fields
- **Order No** — type: `text`, required
- **Customer** — type: `api-select`, required
- **Destination** — type: `text`, required
- **Product Family** — type: `select`
- **Total Quantity (kg)** — type: `number`
- **Delivery Date** — type: `date`
- **Currency** — type: `select`
- **Payment Terms** — type: `text`
- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/order-formSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/order-intake/order-form/`
- `src/services/yard-flow/orderconfirmationService.ts`
- `src/hooks/yard-flow/useNewOrderMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_ORDERCONFIRMATION_BASE_URL = `${BASE_URL}/api/orderconfirmation/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Form validates and submits via mutation hook
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
