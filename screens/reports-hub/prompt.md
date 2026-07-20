# Reports Hub — implementation prompt

![mockup](desktop.png)

## Business context
- **Cluster:** Reports & Analytics (Phase 8)
- **Purpose:** Operational and audit reports across the full lifecycle.
- **Actor:** Manager, Terminal Reviewer

- **Follows:** close-out


### Related screens in this cluster
- [Inventory Report](../report-inventory/prompt.md) (`/yard-flow/reports/inventory`)
- [Loading Report](../report-loading/prompt.md) (`/yard-flow/reports/loading`)
- [In-Transit & Overdue](../report-in-transit-overdue/prompt.md) (`/yard-flow/reports/in-transit`)
- [Discrepancies Report](../report-discrepancies/prompt.md) (`/yard-flow/reports/discrepancies`)
- [Truck Performance](../report-truck-performance/prompt.md) (`/yard-flow/reports/truck-performance`)

## Goal
Reports Hub screen in the **Reports & Analytics** cluster. Used by Manager, Terminal Reviewer.

## Route & placement
- Route: `/yard-flow/reports`
- Sidebar: Yard Flow (L1 rail) → Reports (L2 cluster) → route cluster → Reports Hub (L4)
- Breadcrumb: Yard Flow / Reports / Reports Hub
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_REPORTING_BASE_URL` = `${BASE_URL}/api/reporting/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/reports/*` | Reports Hub action | — | — |
- Auth: mutations require `actor` field. Permissions: reports.read.
- Note: Card grid linking to all report screens.

## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/reports-hub/get-reports-hub.dto.ts`
- `src/lib/types/yard-flow/request/reports-hub/create-reports-hub-request.dto.ts`


## UI spec
- Component pattern: **KPI cards + charts**


- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/reports-hubSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/reports/reports-hub/`
- `src/services/yard-flow/reportingService.ts`
- `src/hooks/yard-flow/useReportsHubMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_REPORTING_BASE_URL = `${BASE_URL}/api/reporting/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Screen actions trigger correct endpoints
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
