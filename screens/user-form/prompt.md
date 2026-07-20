# User — implementation prompt

![mockup](desktop.png)

## Business context
- **Cluster:** Administration (Phase 0)
- **Purpose:** Users, roles, master data, warehouses, depot locations, yard map.
- **Actor:** Admin, Manager


- **Precedes:** order-intake

### Related screens in this cluster
- [Users](../users-list/prompt.md) (`/yard-flow/admin/users`)
- [Roles & Permissions](../roles-permissions/prompt.md) (`/yard-flow/admin/roles`)
- [Master Data](../master-data/prompt.md) (`/yard-flow/admin/master-data`)
- [Master Data Record](../master-data-form/prompt.md) (`/yard-flow/admin/master-data/new`)
- [Warehouses](../warehouses-list/prompt.md) (`/yard-flow/admin/warehouses`)
- [Warehouse](../warehouse-form/prompt.md) (`/yard-flow/admin/warehouses/new`)
- [Depot Locations](../depot-locations-list/prompt.md) (`/yard-flow/admin/depot-locations`)
- [Depot Location](../depot-location-form/prompt.md) (`/yard-flow/admin/depot-locations/new`)
- [Yard Map](../yard-map/prompt.md) (`/yard-flow/admin/yard-map`)

## Goal
User screen in the **Administration** cluster. Used by Admin, Manager.

## Route & placement
- Route: `/yard-flow/admin/users/new`
- Sidebar: Yard Flow (L1 rail) → Administration (L2 cluster) → route cluster → User (L4)
- Breadcrumb: Yard Flow / Admin / User
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_IDENTITYACCESS_BASE_URL` = `${BASE_URL}/api/identityaccess/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `POST` | `/users` | User action | — | — |
| `GET` | `/users/{id}` | User action | — | — |
| `PUT` | `/users/{id}/roles/{roleName}` | User action | — | — |
- Auth: mutations require `actor` field. Permissions: users.write.


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/user-form/get-user-form.dto.ts`
- `src/lib/types/yard-flow/request/user-form/create-user-form-request.dto.ts`


## UI spec
- Component pattern: **react-hook-form + Zod**

### Form fields
- **Display Name** — type: `text`, required
- **Username** — type: `text`, required
- **External Subject** — type: `text`
- **Unit** — type: `select`
- **Roles** — type: `chips`
- **Active** — type: `toggle`
- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/user-formSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/administration/user-form/`
- `src/services/yard-flow/identityaccessService.ts`
- `src/hooks/yard-flow/useUserMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_IDENTITYACCESS_BASE_URL = `${BASE_URL}/api/identityaccess/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Form validates and submits via mutation hook
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
