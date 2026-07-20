# Inventory Search — implementation prompt

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
- [Product Unit](../product-unit-detail/prompt.md) (`/yard-flow/inventory/[id]`)
- [Item Summary](../item-summary/prompt.md) (`/yard-flow/inventory/item-summary`)

## Goal
Inventory Search screen in the **Inbound & Inventory** cluster. Used by Control Office Operator, Yard Operator.

## Route & placement
- Route: `/yard-flow/inventory`
- Sidebar: Yard Flow (L1 rail) → Inbound & Inventory (L2 cluster) → route cluster → Inventory Search (L4)
- Breadcrumb: Yard Flow / Inventory / Inventory Search
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_INVENTORY_BASE_URL` = `${BASE_URL}/api/inventory/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/product-units` | Inventory Search action | — | — |
| `GET` | `/product-units/{id}` | Inventory Search action | — | — |
- Auth: mutations require `actor` field. Permissions: .


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/inventory-search/get-inventory-search.dto.ts`
- `src/lib/types/yard-flow/request/inventory-search/create-inventory-search-request.dto.ts`
- Enums: `src/lib/enums/yard-flow/inventory-status.enum.ts` — values: AvailableInYard, YardSelected, ReleasedToVessel, BijakAllocated, GateExited, VesselReceived

## UI spec
- Component pattern: **GenericTable**
### Columns
- **Product ID** (`productId`) — filter: text
- **Family** (`productFamily`) — filter: text
- **Quality** (`quality`) — filter: text
- **Status** (`status`) — filter: text, status badge
- **Weight** (`weight`) — filter: text
- **Depot** (`zone`) — filter: text

- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/inventory-searchSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/inbound-inventory/inventory-search/`
- `src/services/yard-flow/inventoryService.ts`
- `src/hooks/yard-flow/useInventorySearchMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_INVENTORY_BASE_URL = `${BASE_URL}/api/inventory/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Grid columns, filters, pagination match spec
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
