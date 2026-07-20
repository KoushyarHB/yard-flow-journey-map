# Depot Location — implementation prompt

![mockup](desktop.png)

## Business context
- **Cluster:** Administration (Phase 0)
- **Purpose:** Users, roles, master data, warehouses, depot locations, yard map.
- **Actor:** Admin, Manager


- **Precedes:** order-intake

### Related screens in this cluster
- [Users](../users-list/prompt.md) (`/yard-flow/admin/users`)
- [User](../user-form/prompt.md) (`/yard-flow/admin/users/new`)
- [Roles & Permissions](../roles-permissions/prompt.md) (`/yard-flow/admin/roles`)
- [Master Data](../master-data/prompt.md) (`/yard-flow/admin/master-data`)
- [Master Data Record](../master-data-form/prompt.md) (`/yard-flow/admin/master-data/new`)
- [Warehouses](../warehouses-list/prompt.md) (`/yard-flow/admin/warehouses`)
- [Warehouse](../warehouse-form/prompt.md) (`/yard-flow/admin/warehouses/new`)
- [Depot Locations](../depot-locations-list/prompt.md) (`/yard-flow/admin/depot-locations`)
- [Yard Map](../yard-map/prompt.md) (`/yard-flow/admin/yard-map`)

## Goal
Depot Location screen in the **Administration** cluster. Used by Admin, Manager.

## Route & placement
- Route: `/yard-flow/admin/depot-locations/new`
- Sidebar: Yard Flow (L1 rail) → Administration (L2 cluster) → route cluster → Depot Location (L4)
- Breadcrumb: Yard Flow / Admin / Depot Location
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_YARDLOCATION_BASE_URL` = `${BASE_URL}/api/yardlocation/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `POST` | `/depot-locations` | Depot Location action | — | — |
| `PATCH` | `/depot-locations/{id}` | Depot Location action | — | — |
- Auth: mutations require `actor` field. Permissions: .


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/depot-location-form/get-depot-location-form.dto.ts`
- `src/lib/types/yard-flow/request/depot-location-form/create-depot-location-form-request.dto.ts`


## UI spec
- Component pattern: **react-hook-form + Zod**

### Form fields
- **Warehouse** — type: `api-select`, required
- **Zone** — type: `text`, required
- **Row** — type: `text`
- **Column** — type: `text`
- **Stack** — type: `text`
- **Face / Side** — type: `text`
- **Accessibility Status** — type: `select`, required
- **Accessibility Note** — type: `textarea`
- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/depot-location-formSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/administration/depot-location-form/`
- `src/services/yard-flow/yardlocationService.ts`
- `src/hooks/yard-flow/useDepotLocationMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_YARDLOCATION_BASE_URL = `${BASE_URL}/api/yardlocation/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Form validates and submits via mutation hook
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
