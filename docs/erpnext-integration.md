# ERPNext Integration Preparation

AgencyOS is currently a frontend-only application: every module is backed by
static seed arrays in `src/data/*.ts`, held in memory for the session by nine
Zustand stores under `src/store/`, and mutated only client-side. This
document maps that data model onto [ERPNext](https://frappeframework.com/)'s
DocTypes and lays out the seam a future phase would use to wire a real
backend in — it does not change any runtime behavior.

## Current architecture

- **Data**: `src/data/{agency,crm,delivery,finance,hr,workspace}.ts` — typed
  seed arrays and a handful of derived helpers (e.g. `agingSummary()`,
  `expenseCategoryTotals()`).
- **State**: one Zustand store per bounded context (`clientsStore`,
  `leadsStore`, `projectsStore`, `tasksStore`, `hrStore`, `financeStore`,
  `inboxStore`, `assetsStore`, `settingsStore`), each seeded once from the
  data layer, mutated in place, never persisted or synced.
- **Fetching**: `@tanstack/react-query` is already a dependency and its
  `QueryClientProvider` already wraps the whole app in `src/routes/__root.tsx`
  — but nothing calls `useQuery`/`useMutation` anywhere yet. It's installed
  and idle, which makes it the natural landing spot for real API calls
  rather than a new library choice.

## DocType mapping

| AgencyOS module | Local entity (`src/data`) | ERPNext DocType | Notes |
|---|---|---|---|
| Clients | `Client` (`agency.ts`) | **Customer** | `health`, `mrr` have no native Customer field — would need custom fields or a linked child table. |
| Leads | `Lead` (`crm.ts`) | **Lead** → **Opportunity** on qualification | ERPNext splits pre-qualification (Lead) from pipeline (Opportunity); AgencyOS's single `stage` enum spans both — mapping needs a stage→DocType-plus-status table. |
| Projects | `DeliveryProject` (`delivery.ts`) | **Project** | `budget`/`progress`/`status` map closely to native fields (`estimated_costing`, `percent_complete`, `status`). |
| Tasks | `DeliveryTask` (`delivery.ts`) | **Task** | `checklist`/`comments` sub-structures aren't native Task fields — ERPNext's own Comment/ToDo DocTypes would likely replace them rather than being modeled as JSON blobs. |
| Employees | `Employee` (`agency.ts`) | **Employee** | Mostly direct; `initials`/avatar are presentation-only and have no ERPNext equivalent. |
| Attendance | `AttendanceRecord` (`agency.ts`) | **Attendance** | Direct mapping (`status`, `clockIn`/`clockOut` ≈ `in_time`/`out_time`). |
| Leave | `LeaveRequest` (`agency.ts`) | **Leave Application** | Direct mapping. |
| Payroll | `PayrollRun` (`agency.ts`) | **Salary Slip** (+ **Payroll Entry** for the batch run) | AgencyOS models one row per run; ERPNext models one Salary Slip per employee per run, rolled up under a Payroll Entry. |
| Performance | `performanceByDept` (`agency.ts`) | **Appraisal** | ERPNext's Appraisal is per-employee, not per-department — the department rollup is a derived view, not a stored entity. |
| Invoices | `Invoice` (`finance.ts`) | **Sales Invoice** | Line items, tax rate and status map directly. |
| Expenses | `Expense` (`finance.ts`) | **Expense Claim** | `category` maps to ERPNext's Expense Claim Type. |
| Assets (files) | `AssetFile` / `AssetFolder` (`workspace.ts`) | **File** (native doc attachment) | ERPNext's File DocType is attachment-centric, not a standalone folder tree — the nested-folder UI would need a custom DocType (e.g. a lightweight "Asset Folder") or reuse Frappe's built-in folder support in the File list. |
| Conversations | `Conversation` (`workspace.ts`) | No direct equivalent | Closest native concept is the Communication DocType (linked to any document) — would need re-modeling around "linked record" rather than a freestanding inbox. |
| Notifications | `Notification` (`workspace.ts`) | **Notification Log** | Direct mapping. |
| Departments / Designations | `departmentsSeed` / `designationsSeed` (`workspace.ts`) | **Department** / **Designation** | Direct mapping. |
| Roles / Permissions | `rolesSeed`, `permissionModules`, `defaultPermissionMatrix()` (`workspace.ts`) | **Role** + ERPNext's Role Permission Manager | ERPNext's permission model is per-DocType, not per-"module" — the app's Module→Action grid would need to be re-derived from (or built on top of) real per-DocType role permissions rather than modeled as a flat matrix. |
| Integrations | `integrationsSeed` (`workspace.ts`) | No equivalent | Purely an AgencyOS-side settings concept (Slack/HubSpot/etc. connections); would stay local or move to a custom DocType — ERPNext has no generic "integrations" registry. |

## Recommended integration seam

1. **Introduce a thin service layer**, one file per module under
   `src/services/` (only `dashboardService.ts` exists today), each exposing
   plain async functions (`listClients()`, `updateClient()`, …) that today
   would just resolve the existing seed arrays and later would call the
   ERPNext REST API (`/api/resource/<DocType>`).
2. **Move fetching into TanStack Query** at the point each store currently
   seeds itself — replace the static `clients: seedClients` initializer with
   a `useQuery(['clients'], listClients)` call in the component that reads
   the store, and route mutations (`addClient`, `toggleStar`, …) through
   `useMutation` calling the service layer, with the Zustand store kept only
   for pure client-side UI state (selected id, filters, drawer open/closed)
   rather than as the system of record.
3. **Auth**: ERPNext expects either a session cookie (browser login flow) or
   an API key/secret pair sent as `Authorization: token <key>:<secret>`.
   For a server-rendered TanStack Start app, the key/secret pair should be
   read server-side only (never bundled into client JS) and proxied through
   a TanStack Start server function, so the frontend never holds ERPNext
   credentials directly.
4. **Suggested rollout order**: start with read-only, low-risk modules
   (Clients, Projects) to validate the DocType mapping and auth proxy, then
   Tasks/Employees, then the write-heavy modules (Invoices, Expenses,
   Leave) last, since those carry approval workflows worth testing
   carefully against ERPNext's own workflow engine rather than
   reimplementing approvals purely client-side.

## What this phase deliberately does not do

No store, route, or component was changed to call a network API — there is
no ERPNext instance available to this environment to integrate against or
test against. This document is the mapping and seam design a future phase
would execute against a real ERPNext site.
