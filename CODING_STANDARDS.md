# QuickSeva Coding Standards

These standards describe the current portfolio MVP. Keep changes small, preserve API behavior, and use fictional demo data only.

## Backend package layout

The Java base package remains `com.quickseva.api`. Current production layout:

```text
com.quickseva.api
├── QuickSevaApiApplication
├── auth/
│   ├── controller/
│   ├── dto/request/
│   ├── dto/response/
│   └── service/
├── catalog/
│   ├── controller/
│   ├── dto/response/
│   └── service/
├── application/
│   ├── config/
│   ├── controller/
│   ├── dto/request/
│   ├── dto/response/
│   ├── entity/
│   ├── repository/
│   └── service/
├── common/exception/
├── config/
└── security/
    ├── config/
    └── filter/
```

The test tree mirrors feature packages under `src/test/java/com/quickseva/api`; cross-feature architecture tests live in `architecture/`. The repository has no payment feature, external clients, or mapper needs, so those packages are intentionally absent.

## Java and Spring

- Use the Maven-managed Java 21 release. Do not raise the Java or Spring Boot baseline without checking all framework, build-plugin, and runtime support first.
- Organize code by QuickSeva feature first, then by responsibility: `auth/controller`, `auth/service`, `auth/dto/request`, `auth/dto/response`; `catalog/controller`, `catalog/service`, `catalog/dto/response`; and `application/controller`, `application/service`, `application/dto/request`, `application/dto/response`, `application/repository`, `application/entity`, `application/config`. Keep shared API errors in `common/exception`, security filters/configuration in `security`, and cross-cutting application configuration in `config`.
- Use the real application package `com.quickseva.api`; do not copy generic example names such as `com.example.app`, `user`, `order`, or `payment` when those features do not exist here.
- Mirror production package names under `src/test/java`. Keep test-only fixtures out of production packages.
- Use four-space indentation and Google Java Format. Keep package names lowercase; use `UpperCamelCase` for types, `lowerCamelCase` for methods and fields, and uppercase names for constants.
- Prefer constructor injection, immutable configuration objects, records for API DTOs, and focused controller/service/repository responsibilities.
- Add service interfaces and `service/impl` only when the abstraction has a real second implementation or separates a stable contract. Add mapper, client, event, validation, or feature-specific exception packages only when the feature actually uses them.
- Keep controllers responsible for HTTP mapping, boundary validation, and delegation. Controllers must not call repositories, contain transaction boundaries, or implement business workflows. Put business rules and repository coordination in constructor-injected services; keep transaction boundaries on service operations. Use request/response DTOs, never expose JPA entities directly.
- Validate input at HTTP boundaries. Return consistent Problem Details and do not include internal exception details in client responses.
- Use `@Transactional` for state-changing workflows. Keep persistence entities private to the backend and use parameterized Spring Data queries.
- Preserve the demo-only contract. Never retain identity form fields, accept real documents, or imply government submission, identity verification, payments, or external API integration.
- Use SLF4J parameterized logging. Never log credentials, bearer tokens, identity data, or submitted form payloads. Handle expected malformed demo tokens as authentication failures; do not swallow unexpected exceptions.
- Keep security rules least-privilege. Demo secrets and H2 console access are development-only; the console is disabled by default.

## Tests and quality checks

- Add deterministic JUnit tests for security boundaries, validation, business transitions, and API behavior. Mock external boundaries rather than internal methods.
- Run `mvn -B verify` in `backend/`. It compiles, runs tests, and applies Checkstyle conventions.
- Run `mvn spotless:apply` in `backend/` to apply formatting. Run `mvn spotless:check` and `mvn checkstyle:check` to run the individual checks. Formatting remains an explicit local check until legacy files are migrated without obscuring functional changes.
- Keep static checks focused on naming and import hygiene; expand them gradually as existing code is brought into compliance.
- ArchUnit tests enforce that controllers do not depend on repositories or entities, services do not depend on controllers, and shared code does not depend on feature packages.
- CI verifies the backend on Java 21. Do not claim a check passed unless it was executed successfully.

## API, configuration, and persistence

- Preserve existing `/api` routes and response shapes. Validate DTOs with Jakarta Bean Validation and use centralized API exception mapping.
- Bind application settings using validated `@ConfigurationProperties`; keep secrets and environment-specific values out of business logic.
- Keep H2 demo data fictional. Do not introduce schema changes without a clear requirement. Disable database consoles and unsafe operational endpoints by default.
- Avoid speculative optimization. When listing application histories, fetch events in a bulk query instead of one query per list item.
- Infrastructure seed configuration may coordinate repositories to create fictional startup data; do not use it as a substitute for application service workflows.
