# Master Data Record — implementation prompt

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
- [Warehouses](../warehouses-list/prompt.md) (`/yard-flow/admin/warehouses`)
- [Warehouse](../warehouse-form/prompt.md) (`/yard-flow/admin/warehouses/new`)
- [Depot Locations](../depot-locations-list/prompt.md) (`/yard-flow/admin/depot-locations`)
- [Depot Location](../depot-location-form/prompt.md) (`/yard-flow/admin/depot-locations/new`)
- [Yard Map](../yard-map/prompt.md) (`/yard-flow/admin/yard-map`)

## Goal
Master Data Record screen in the **Administration** cluster. Used by Admin, Manager.

## Route & placement
- Route: `/yard-flow/admin/master-data/new`
- Sidebar: Yard Flow (L1 rail) → Administration (L2 cluster) → route cluster → Master Data Record (L4)
- Breadcrumb: Yard Flow / Admin / Master Data Record
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_MASTERDATA_BASE_URL` = `${BASE_URL}/api/masterdata/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `POST` | `/records` | Master Data Record action | — | — |
| `GET` | `/records/{id}` | Master Data Record action | — | — |
| `PATCH` | `/records/{id}` | Master Data Record action | — | — |
- Auth: mutations require `actor` field. Permissions: masterdata.write.


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/master-data-form/get-master-data-form.dto.ts`
- `src/lib/types/yard-flow/request/master-data-form/create-master-data-form-request.dto.ts`


## UI spec
- Component pattern: **react-hook-form + Zod**

### Form fields
- **Type** — type: `select`, required
- **Code** — type: `text`, required
- **Display Name** — type: `text`, required
- **Metadata** — type: `textarea`
- **Active** — type: `toggle`
- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/master-data-formSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/administration/master-data-form/`
- `src/services/yard-flow/masterdataService.ts`
- `src/hooks/yard-flow/useMasterDataRecordMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_MASTERDATA_BASE_URL = `${BASE_URL}/api/masterdata/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Form validates and submits via mutation hook
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
