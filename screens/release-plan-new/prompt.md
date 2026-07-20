# New Release Plan — implementation prompt

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
- [Release Plan](../release-plan-workspace/prompt.md) (`/yard-flow/release/[id]`)

## Goal
New Release Plan screen in the **Vessel Planning & Release** cluster. Used by Control Office Operator, Manager.

## Route & placement
- Route: `/yard-flow/release/new`
- Sidebar: Yard Flow (L1 rail) → Vessel & Release (L2 cluster) → route cluster → New Release Plan (L4)
- Breadcrumb: Yard Flow / Release / New Release Plan
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_RELEASE_BASE_URL` = `${BASE_URL}/api/release/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `POST` | `/release-plans` | New Release Plan action | — | — |
- Auth: mutations require `actor` field. Permissions: .


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/release-plan-new/get-release-plan-new.dto.ts`
- `src/lib/types/yard-flow/request/release-plan-new/create-release-plan-new-request.dto.ts`


## UI spec
- Component pattern: **react-hook-form + Zod**

### Form fields
- **Release No** — type: `text`, required
- **Vessel** — type: `api-select`
- **Voyage** — type: `api-select`
- **Export Permit** — type: `api-select`
- **Destination** — type: `text`
- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/release-plan-newSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/vessel-release/release-plan-new/`
- `src/services/yard-flow/releaseService.ts`
- `src/hooks/yard-flow/useNewReleasePlanMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_RELEASE_BASE_URL = `${BASE_URL}/api/release/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Form validates and submits via mutation hook
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
