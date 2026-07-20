# Product Unit — implementation prompt

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
- [Receiving Record](../receiving-detail/prompt.md) (`/yard-flow/receiving/[id]`)
- [Inventory Search](../inventory-search/prompt.md) (`/yard-flow/inventory`)
- [Item Summary](../item-summary/prompt.md) (`/yard-flow/inventory/item-summary`)

## Goal
Product Unit screen in the **Inbound & Inventory** cluster. Used by Control Office Operator, Yard Operator.

## Route & placement
- Route: `/yard-flow/inventory/[id]`
- Sidebar: Yard Flow (L1 rail) → Inbound & Inventory (L2 cluster) → route cluster → Product Unit (L4)
- Breadcrumb: Yard Flow / Inventory / Product Unit
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_INVENTORY_BASE_URL` = `${BASE_URL}/api/inventory/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/product-units/{id}` | Product Unit action | — | — |
| `POST` | `/product-units/{id}/status` | Product Unit action | — | — |
- Auth: mutations require `actor` field. Permissions: .
- Note: Lifecycle stepper + movements timeline + status change dialog.

## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/product-unit-detail/get-product-unit-detail.dto.ts`
- `src/lib/types/yard-flow/request/product-unit-detail/create-product-unit-detail-request.dto.ts`


## UI spec
- Component pattern: **Detail view + actions**


- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/product-unit-detailSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/inbound-inventory/product-unit-detail/`
- `src/services/yard-flow/inventoryService.ts`
- `src/hooks/yard-flow/useProductUnitMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_INVENTORY_BASE_URL = `${BASE_URL}/api/inventory/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Screen actions trigger correct endpoints
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
