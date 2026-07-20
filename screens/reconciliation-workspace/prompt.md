# Reconciliation — implementation prompt

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
- [New Reconciliation](../reconciliation-new/prompt.md) (`/yard-flow/reconciliation/new`)

## Goal
Reconciliation screen in the **Close-out** cluster. Used by Terminal Reviewer.

## Route & placement
- Route: `/yard-flow/reconciliation/[id]`
- Sidebar: Yard Flow (L1 rail) → Reconciliation (L2 cluster) → route cluster → Reconciliation (L4)
- Breadcrumb: Yard Flow / Reconciliation / Reconciliation
- Register in `getSidebarItems.ts` under top-level `yardFlow` key (same level as `commercial`)

## Backend API
- Base URL constant: `YF_RECONCILIATION_BASE_URL` = `${BASE_URL}/api/reconciliation/v1`
- Endpoints:
  | Method | Path | Purpose | Request DTO | Response DTO |
  |--------|------|---------|-------------|--------------|
| `GET` | `/reconciliations/{id}` | Reconciliation action | — | — |
| `POST` | `/reconciliations/{id}/discrepancies` | Reconciliation action | — | — |
| `POST` | `/reconciliations/{id}/close` | Reconciliation action | — | — |
| `POST` | `/reconciliations/{id}/reopen` | Reconciliation action | — | — |
- Auth: mutations require `actor` field. Permissions: reconciliation.close.
- Note: Expected vs counted metrics; discrepancy resolve workflow.

## Data model (frontend types to add)
- `src/lib/types/yard-flow/response/reconciliation-workspace/get-reconciliation-workspace.dto.ts`
- `src/lib/types/yard-flow/request/reconciliation-workspace/create-reconciliation-workspace-request.dto.ts`


## UI spec
- Component pattern: **Form + DynamicTable workspace**


- Toolbar actions mapped to endpoints listed above.
- Status badges use semantic tones (green=confirmed, amber=draft, red=rejected, blue=in-progress).
- States: loading skeleton, empty state, error toast, permission-gated hide/disable.
- Validation: Zod schema in `src/lib/schema/yard-flow/reconciliation-workspaceSchema.ts`.

## Files to create
- `src/app/[locale]/yard-flow/...` — thin route wrapper
- `src/components/pages/yard-flow/close-out/reconciliation-workspace/`
- `src/services/yard-flow/reconciliationService.ts`
- `src/hooks/yard-flow/useReconciliationMutations.ts`
- Add under `yardFlow` in `src/utils/getSidebarItems.ts` (top-level sibling of commercial)
- Add `export const YF_RECONCILIATION_BASE_URL = `${BASE_URL}/api/reconciliation/v1`;` to `src/constants/baseUrl.ts`

## Acceptance criteria
- [ ] Route renders with Yard Flow rail item active + correct cluster submenu highlight
- [ ] All API endpoints wired with correct DTOs
- [ ] Screen actions trigger correct endpoints
- [ ] Permission-gated UI elements respect roles
- [ ] Matches tms.frontend design tokens and shared components
