# New Reconciliation — implementation prompt

![mockup](desktop.png)

## Business context
- **Cluster:** Close-out (Phase 7)
- **Purpose:** End-of-shift reconciliation: expected vs counted metrics, resolve discrepancies, close.
- **Actor:** Terminal Reviewer
- **Workflow position:** `reconciliation-new → reconciliation-workspace → resolve discrepancies → close`
- **Follows:** loading-pipeline
- **Precedes:** reports

### Related screens in this cluster
- [Reconciliations](../reconciliations-list/prompt.md) (`/yard-flow/reconciliation`)
- [Reconciliation](../reconciliation-workspace/prompt.md) (`/yard-flow/reconciliation/[id]`)

## Goal
New Reconciliation screen in the **Close-out** cluster. Used by Terminal Reviewer.

## Route & placement
- Route: `/yard-flow/reconciliation/new`
- Sidebar: Yard Flow (L1 rail) → Reconciliation (L2 cluster) → route cluster → New Reconciliation (L4)
- Breadcrumb: Yard Flow / Reconciliation / New Reconciliation
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_RECONCILIATION_BASE_URL` = `${BASE_URL}/api/reconciliation/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `POST` | `/reconciliations` | New Reconciliation action | — | — |
- Auth: mutations require `actor` field. Permissions: .


## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/reconciliation-new/get-reconciliation-new.dto.ts`
- `src/lib/types/yard-flow/request/reconciliation-new/create-reconciliation-new-request.dto.ts`


## UI spec
- Component pattern: **react-hook-form + Zod**

### Form fields
- **Date** — type: `date`, required
- **Shift** — type: `select`
- **Vessel** — type: `api-select`
- **Notes** — type: `textarea`
- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/reconciliation-newSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/close-out/reconciliation-new/`
- `src/services/yard-flow/reconciliationService.ts`
- `src/hooks/yard-flow/useNewReconciliationMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_RECONCILIATION_BASE_URL = `${BASE_URL}/api/reconciliation/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Form validates and submits via mutation hook
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
