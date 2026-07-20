# Rail Receipt (BOL) — implementation prompt

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
- [Receiving Record](../receiving-detail/prompt.md) (`/yard-flow/receiving/[id]`)
- [Inventory Search](../inventory-search/prompt.md) (`/yard-flow/inventory`)
- [Product Unit](../product-unit-detail/prompt.md) (`/yard-flow/inventory/[id]`)
- [Item Summary](../item-summary/prompt.md) (`/yard-flow/inventory/item-summary`)

## Goal
Rail Receipt (BOL) screen in the **Inbound & Inventory** cluster. Used by Control Office Operator, Yard Operator.

## Route & placement
- Route: `/yard-flow/receiving/rail/new`
- Sidebar: Yard Flow (L1 rail) → Inbound & Inventory (L2 cluster) → route cluster → Rail Receipt (BOL) (L4)
- Breadcrumb: Yard Flow / Receiving / Rail Receipt (BOL)
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_RECEIVING_BASE_URL` = `${BASE_URL}/api/receiving/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `POST` | `/rail-receipts` | Rail Receipt (BOL) action | — | — |
- Auth: mutations require `actor` field. Permissions: .


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/rail-receipt-form/get-rail-receipt-form.dto.ts`
- `src/lib/types/yard-flow/request/rail-receipt-form/create-rail-receipt-form-request.dto.ts`


## UI spec
- Component pattern: **react-hook-form + Zod**

### Form fields
- **Document No** — type: `text`, required
- **Wagon No** — type: `text`, required
- **Product ID** — type: `text`, required
- **Actual Gross Weight (kg)** — type: `number`
- **Depot Location** — type: `api-select`
- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/rail-receipt-formSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/inbound-inventory/rail-receipt-form/`
- `src/services/yard-flow/receivingService.ts`
- `src/hooks/yard-flow/useRailReceipt(BOL)Mutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_RECEIVING_BASE_URL = `${BASE_URL}/api/receiving/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Form validates and submits via mutation hook
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
