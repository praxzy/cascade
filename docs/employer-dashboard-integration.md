# Employer Dashboard Integration Status

## Overview

This document captures the current state of the employer dashboard implementation and outlines the remaining work required to reach full end-to-end integration with the Cascade payment stream program. The UI now consumes live Solana state via the generated client hooks; all data-fetching and mutation flows are wired to on-chain instructions, replacing the former mock scaffolding.

## Completed Work

- **State management & persistence**
  - Added organization/employee persistence (with localStorage fallbacks) and modal state orchestration in `src/components/dashboard/dashboard-context.tsx`.
  - Wallet banner now reflects the connected signer, cluster, and default mint (`header/wallet-banner.tsx`).

- **Data layer**
  - Implemented `useEmployerStreamsQuery` + helpers for PDA derivation, vault balances, inactivity metrics (`src/features/cascade/data-access/use-employer-streams-query.ts`, `stream-helpers.ts`).
  - Unified cache invalidation for single stream and employer-level queries (`use-invalidate-payment-stream-query.ts`).

- **Streams experience**
  - Streams list, detail drawer, and action buttons render real Solana data, including runway, available balance, and inactivity warnings (`streams/streams-list.tsx`, `stream-detail-drawer.tsx`, `stream-action-buttons.tsx`).
  - Overview KPIs/alerts and right-rail cards derive totals from live stream summaries (`tabs/overview-tab.tsx`, `right-rail/dashboard-right-rail.tsx`, `overview/overview-metrics.tsx`).
  - Employees tab shows live directory data, including linked-stream counts (`employees/employee-directory.tsx`, `employees-tab.tsx`, `employee-detail-panel.tsx`).

- **Mutation flows**
  - Create/top-up/emergency-withdraw/close modals call the respective Cascade instruction hooks with on-chain validation (`modals/create-stream-modal.tsx`, `top-up-stream-modal.tsx`, `emergency-withdraw-modal.tsx`, `close-stream-modal.tsx`).
  - Mutations persist default mint/employer token account choices to reuse across sessions.

- **Type-safety/tooling**
  - Added parsing/formatting helpers for bigint token maths (`stream-helpers.ts`).
  - Ensured `pnpm tsc --noEmit` passes with the new data layer.

## Remaining Gaps Before Full Integration

1. **Wallet experience**
   - Revisit onboarding to require mint + employer token account selection up front, removing modal warnings.
   - Add guard rails in Settings → Wallets to persist the treasury token account via backend or secure storage (currently localStorage).

2. **Employee directory**
   - Replace local persistence with real backend mutations (draft/invited states, invitations, archiving).
   - Provide on-chain wallet validation + ENS lookup if required by UX spec.

3. **Streams activity**
   - `StreamActivityHistory` still shows placeholder events; hook it to the on-chain transaction log or an indexer.
   - Add pagination/filtering for employers with large stream sets.

4. **Instruction UX polish**
   - Integrate token account discovery (ATA lookup + creation) instead of requiring manual entry in modals.
   - Add transaction progress indicators (signature links, retry states) to align with `toastTx`.

5. **Backend/API integration**
   - Persist organization profile, onboarding wizard state, and alerts server-side once the API exists (remove localStorage shim).
   - Wire alert center to real notification sources (webhook/SQS/etc.).

6. **Testing & hardening**
   - Add unit tests for stream helper maths and React Query hooks (mock RPC).
   - Add Cypress/Playwright coverage for critical flows (create/top-up/emergency/close).

## Suggested Next Steps

1. **Token account discovery**
   - Leverage `getAssociatedTokenAccountAddress` to suggest ATAs and fall back to manual entry only when necessary.
   - Populate mint/token metadata via a small registry or on-chain fetch to improve modal defaults.

2. **Activity/feed integration**
   - Implement a lightweight fetch that combines program logs (`gill` RPC `getSignaturesForAddress`) with toast history to populate the Stream Activity panel.

3. **Backend alignment**
   - Define API contracts for organization profile + employee management so local persistence can be swapped out cleanly.
   - Mirror the query keys used here in the backend to simplify cache invalidation across tabs.

4. **UX refinement**
   - Add validation messaging to modals (invalid public keys, decimals out of range, insufficient deposit vs. hourly rate).
   - Surface Polled status (pending confirmation) in the StreamDetail drawer using mutation results/signature subscriptions.

## Validation

Run the TypeScript compiler to ensure the data/mutation layers stay type-safe:

```bash
pnpm tsc --noEmit
```

The dashboard now reflects real on-chain data, enabling the remaining work to focus on backend persistence, richer activity reporting, and expanded UX flows (employee invites, alerts, etc.).
