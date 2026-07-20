# Release Plan — implementation prompt

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
- [Export Permits (Kotaj)](../export-permits-list/prompt.md) (`/yard-flow/vessels/export-permits`)
- [Export Permit](../export-permit-form/prompt.md) (`/yard-flow/vessels/export-permits/new`)
- [Release Plans](../release-plans-list/prompt.md) (`/yard-flow/release`)
- [New Release Plan](../release-plan-new/prompt.md) (`/yard-flow/release/new`)

## Goal
Release Plan screen in the **Vessel Planning & Release** cluster. Used by Control Office Operator, Manager.

## Route & placement
- Route: `/yard-flow/release/[id]`
- Sidebar: Yard Flow (L1 rail) → Vessel & Release (L2 cluster) → route cluster → Release Plan (L4)
- Breadcrumb: Yard Flow / Release / Release Plan
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_RELEASE_BASE_URL` = `${BASE_URL}/api/release/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/release-plans/{id}` | Release Plan action | — | — |
| `POST` | `/release-plans/{id}/confirm` | Release Plan action | — | — |
| `POST` | `/release-plans/{id}/close` | Release Plan action | — | — |
| `POST` | `/release-plans/{id}/cancel` | Release Plan action | — | — |
| `POST` | `/release-plans/{id}/lines/{productUnitReference}/reverse` | Release Plan action | — | — |
- Auth: mutations require `actor` field. Permissions: .
- Note: Header + lines DynamicTable + confirm/close/cancel/reverse-line.

## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/release-plan-workspace/get-release-plan-workspace.dto.ts`
- `src/lib/types/yard-flow/request/release-plan-workspace/create-release-plan-workspace-request.dto.ts`


## UI spec
- Component pattern: **Form + DynamicTable workspace**


- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/release-plan-workspaceSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/vessel-release/release-plan-workspace/`
- `src/services/yard-flow/releaseService.ts`
- `src/hooks/yard-flow/useReleasePlanMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_RELEASE_BASE_URL = `${BASE_URL}/api/release/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Screen actions trigger correct endpoints
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
