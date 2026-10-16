# QuickSeva

QuickSeva is a portfolio MVP for preparing and tracking fictional document-service applications from home. It is a demo: **no real government service, department, portal, identity check, payment, or submission is connected.** Fees, requirements, people, documents, status updates, and timelines are sample data.

## Brand

The QuickSeva identity uses a forward bolt and speed lines to communicate faster, guided service preparation. The wordmark and install icon are in `public/quickseva-wordmark.svg` and `public/quickseva-mark.svg`.

## Features

- Mobile-first installable React PWA with the existing onboarding and customer screens.
- Demo sign-in, service catalogue/details, application wizard, save draft, and submit demo request.
- Application list, status timeline, sample document checklist, profile, notifications, and support previews.
- Worker demo queue for advancing application statuses. The customer timeline refreshes while open.
- Local sample mode when the API is unavailable; local changes are temporary and do not reach the backend.

## Architecture and stack

```text
React 19 + Vite PWA + Lucide React icons  →  Spring Boot REST API  →  Spring Data JPA  →  H2 database
                              demo auth, services, applications, status history
```

The Vite dev server proxies `/api` to `http://localhost:8080`. H2 and fictional seed records keep the backend self-contained for local demonstrations.

The backend uses a feature-first package layout under `com.quickseva.api`: `auth`, `catalog`, and `application` each separate their API, service, DTO, or persistence responsibilities. Cross-cutting errors, security, and application configuration live in `common`, `security`, and `config`.

## Run locally

Install Node.js 20.19+ (or 22.12+), pnpm 11.25+, Java 21, and Maven 3.9+. Open a terminal in the project root folder. Java 21 is the configured compiler release and CI runtime.

**1. Start the backend** in one terminal:

```powershell
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080`; H2 stores data in `backend/data/` and seeds a sample passport application. Run backend tests and CI static checks with `mvn -B verify` from `backend/`. Apply Java formatting with `mvn spotless:apply`; check it separately with `mvn spotless:check`. Run naming/import checks with `mvn checkstyle:check`. The formatter is available as a separate command so the legacy files can be migrated without an unrelated full-backend formatting diff. The H2 console is disabled by default; enable it only for local development with `H2_CONSOLE_ENABLED=true`.

**2. Start the frontend** in a second terminal at the project root folder:

```powershell
pnpm install
pnpm dev
```

Open the Vite URL, normally `http://localhost:5173`. If PowerShell cannot find `pnpm` in this Codex environment, use:

```powershell
$pnpm = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd'
& $pnpm install
& $pnpm dev
```

Without the backend, the app switches to browser-local sample mode. Reload after starting the API to use database-backed flows. Build the frontend with `pnpm build`; preview the build with `pnpm preview`.

## Free public demo deployment

The repository includes a Docker build and a Render Blueprint for a single-origin deployment: Render serves the Vite PWA from the Spring Boot app, and `/api` requests go to the same service. This keeps the demo simple and avoids a separate API host or CORS setup.

1. Push this project folder to a GitHub repository you control. Keep the repository public if you want an easy-to-review portfolio project; never commit `.env` files, signing secrets, or real user data.
2. Create a free Render account, choose **New → Blueprint**, connect the repository, and deploy the `render.yaml` Blueprint. Render generates `DEMO_TOKEN_SECRET` for the service.
3. After the first deploy succeeds, open its `https://quickseva-….onrender.com` URL and test the customer demo (`5551234567`, code `123456`) and worker demo (`5550000001`, code `123456`). The same URL serves the app and its API.

Render free web services sleep after 15 minutes without traffic and can take about a minute to wake on the next request. Their local filesystem is ephemeral, so the H2 demo database and visitor-created applications can reset on sleep, restart, or redeploy. The app seeds a sample application again after a reset. All visitors use the same fictional demo backend and the worker account can change sample statuses; do not enter real personal data. Render describes free services as suitable for hobby projects and previews, not production use. See [Render’s free instance limits](https://render.com/docs/free) and [Blueprint reference](https://render.com/docs/blueprint-spec).

Deployment requires the project to be pushed to a Git provider and connected to a Render account. Once the deployment finishes, copy the `onrender.com` URL into your resume or LinkedIn project entry.

## Demo accounts

| Role | Fictional phone | Demo code |
| --- | --- | --- |
| Customer | `5551234567` | `123456` |
| Worker | `5550000001` | `123456` |

No SMS is sent. Sign in as the worker to update the preloaded sample request or requests created by the customer demo account.

## API overview

Protected endpoints use `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/services` | Fictional service catalogue |
| `POST` | `/api/auth/demo-login` · `GET /api/auth/me` | Demo session |
| `GET` | `/api/applications` · `POST /api/applications` | List applications; create draft or submitted request |
| `POST` | `/api/applications/{id}/submit` | Submit a saved draft in the demo |
| `GET` | `/api/applications/{id}` · `/timeline` · `/history` | Details and status tracking |
| `GET` | `/api/worker/applications` | Worker queue |
| `PATCH` | `/api/worker/applications/{id}/status` | Advance one demo status step |

Errors return JSON Problem Details; validation errors include field messages. See `backend/src/main/resources/application.properties` for environment configuration (`PORT`, `DATABASE_URL`, demo token settings, and demo account numbers).

## Backend standards

See [`CODING_STANDARDS.md`](CODING_STANDARDS.md) for Java/Spring conventions. [`AGENTS.md`](AGENTS.md) gives coding-agent build and safety instructions. Maven pins Spotless, Google Java Format, Checkstyle, and ArchUnit versions. ArchUnit tests protect controller/service/shared-package boundaries. GitHub Actions runs `mvn --batch-mode --no-transfer-progress verify` on Java 21 for backend changes.

The project remains on Spring Boot 4.1.1 and Java 21. The [official Spring Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html) list compatibility through Java 26 for 4.1.1, so Java 27 support is not established; the project does not target or claim compatibility with JDK 27. Re-evaluate after upstream support and all plugin/dependency compatibility can be verified.

## Walkthrough plan

1. Sign in with the customer demo account; browse services and open a service detail page.
2. Complete the sample wizard. Save a draft, submit it from **My Applications**, then open its timeline.
3. Return to sign-in and enter the worker demo account. Advance the seeded or new request by one status step.
4. Sign back in as the customer and open tracking; the updated status appears in the timeline (automatic refresh while the page is open).

For a compact portfolio capture, use one mobile viewport and record: catalogue/detail → wizard confirmation → application list → tracking timeline → worker queue/status update. No screenshots are stored in this repository yet; this sequence is the recommended capture plan.

## Limitations

- All identities, records, service information, fees, requirements, dates, notifications, and statuses are fictional or illustrative. Verify any real-world detail with official sources.
- OTP is a fixed demo code; authentication is not production-ready.
- Wizard identity fields and document selections are previews; submitted identity/form values are discarded. No sensitive document files are uploaded or stored.
- Payment, government portals/APIs, official applications, identity verification, live support, and notifications are not integrated. Status progression is simulated by the worker demo.
- H2 schema auto-update and demo credentials are for development only. The H2 console is disabled by default; do not expose it or the default demo signing secret publicly.
