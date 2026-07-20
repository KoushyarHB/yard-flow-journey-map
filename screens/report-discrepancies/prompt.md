# Discrepancies Report — implementation prompt

![mockup](desktop.png)

## Business context
- **Cluster:** Reports & Analytics (Phase 8)
- **Purpose:** Operational and audit reports across the full lifecycle.
- **Actor:** Manager, Terminal Reviewer

- **Follows:** close-out


### Related screens in this cluster
- [Reports Hub](../reports-hub/prompt.md) (`/yard-flow/reports`)
- [Inventory Report](../report-inventory/prompt.md) (`/yard-flow/reports/inventory`)
- [Loading Report](../report-loading/prompt.md) (`/yard-flow/reports/loading`)
- [In-Transit & Overdue](../report-in-transit-overdue/prompt.md) (`/yard-flow/reports/in-transit`)
- [Truck Performance](../report-truck-performance/prompt.md) (`/yard-flow/reports/truck-performance`)

## Goal
Discrepancies Report screen in the **Reports & Analytics** cluster. Used by Manager, Terminal Reviewer.

## Route & placement
- Route: `/yard-flow/reports/discrepancies`
- Sidebar: Yard Flow (L1 rail) → Reports (L2 cluster) → route cluster → Discrepancies Report (L4)
- Breadcrumb: Yard Flow / Reports / Discrepancies Report
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_REPORTING_BASE_URL` = `${BASE_URL}/api/reporting/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/reports/discrepancies` | Discrepancies Report action | — | — |
- Auth: mutations require `actor` field. Permissions: .


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/report-discrepancies/get-report-discrepancies.dto.ts`
- `src/lib/types/yard-flow/request/report-discrepancies/create-report-discrepancies-request.dto.ts`


## UI spec
- Component pattern: **Filters + GenericTable report**
### Columns
- **Type** (`discrepancy`) — filter: text, status badge
- **Bijak** (`bijakNo`) — filter: text
- **Date** (`date`) — filter: text

- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/report-discrepanciesSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/reports/report-discrepancies/`
- `src/services/yard-flow/reportingService.ts`
- `src/hooks/yard-flow/useDiscrepanciesReportMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_REPORTING_BASE_URL = `${BASE_URL}/api/reporting/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Grid columns, filters, pagination match spec
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
