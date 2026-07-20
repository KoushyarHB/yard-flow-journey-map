# Export Permits (Kotaj) — implementation prompt

![mockup](desktop.png)

## Business context
- **Cluster:** Vessel Planning & Release (Phase 3)
- **Purpose:** Register vessels/voyages/Kotaj, create release plans allocating units to vessels.
- **Actor:** Control Office Operator, Manager
- **Workflow position:** `vessel-form → voyage-form → export-permit-form → release-plan-new → release-plan-workspace → confirm`
- **Follows:** inbound-inventory
- **Precedes:** yard-operations

### Related screens in this cluster
- [Vessels](../vessels-list/prompt.md) (`/yard-flow/vessels`)
- [Vessel](../vessel-form/prompt.md) (`/yard-flow/vessels/new`)
- [Voyages](../voyages-list/prompt.md) (`/yard-flow/vessels/voyages`)
- [Voyage](../voyage-form/prompt.md) (`/yard-flow/vessels/voyages/new`)
- [Export Permit](../export-permit-form/prompt.md) (`/yard-flow/vessels/export-permits/new`)
- [Release Plans](../release-plans-list/prompt.md) (`/yard-flow/release`)
- [Release Plan](../release-plan-workspace/prompt.md) (`/yard-flow/release/[id]`)
- [New Release Plan](../release-plan-new/prompt.md) (`/yard-flow/release/new`)

## Goal
Export Permits (Kotaj) screen in the **Vessel Planning & Release** cluster. Used by Control Office Operator, Manager.

## Route & placement
- Route: `/yard-flow/vessels/export-permits`
- Sidebar: Yard Flow (L1 rail) → Vessel & Release (L2 cluster) → route cluster → Export Permits (Kotaj) (L4)
- Breadcrumb: Yard Flow / Vessels / Export Permits (Kotaj)
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_VESSEL_BASE_URL` = `${BASE_URL}/api/vessel/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/export-permits` | Export Permits (Kotaj) action | — | — |
| `POST` | `/export-permits` | Export Permits (Kotaj) action | — | — |
- Auth: mutations require `actor` field. Permissions: .


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/export-permits-list/get-export-permits-list.dto.ts`
- `src/lib/types/yard-flow/request/export-permits-list/create-export-permits-list-request.dto.ts`
- Enums: `src/lib/enums/yard-flow/vessel-status.enum.ts` — values: Draft, Issued, Closed, Cancelled

## UI spec
- Component pattern: **GenericTable**
### Columns
- **Permit No** (`permitNo`) — filter: text
- **Kotaj** (`kotaj`) — filter: text
- **Vessel** (`vessel`) — filter: text
- **Status** (`status`) — filter: text, status badge
- **Weight** (`weight`) — filter: text

- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/export-permits-listSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/vessel-release/export-permits-list/`
- `src/services/yard-flow/vesselService.ts`
- `src/hooks/yard-flow/useExportPermits(Kotaj)Mutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_VESSEL_BASE_URL = `${BASE_URL}/api/vessel/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Grid columns, filters, pagination match spec
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
