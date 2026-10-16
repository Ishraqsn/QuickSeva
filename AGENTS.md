# Agent instructions

- Follow [CODING_STANDARDS.md](CODING_STANDARDS.md) and preserve the documented demo-only behavior.
- The frontend lives at the repository root. The Spring Boot API and Maven checks live in `backend/`.
- Backend Java is feature-first under `backend/src/main/java/com/quickseva/api`: keep controller, service, repository, entity, request/response DTO, config, security, and shared exception responsibilities in their matching packages. Controllers delegate through services and must not access repositories or entities. Keep transaction boundaries in application services. Mirror production packages in `backend/src/test/java`; ArchUnit tests enforce the key boundaries.
- Before backend changes, inspect `backend/pom.xml`, the affected code, application configuration, and tests. Preserve Java 21 and Spring Boot 4.1.1 unless compatibility is verified and the change is required.
- Validate backend changes with `cd backend` then `mvn -B verify`; format Java with `mvn spotless:apply`.
- Keep real government portals, identity verification, payment, SMS, and document storage out of this MVP. Never commit, push, deploy, or store credentials.
