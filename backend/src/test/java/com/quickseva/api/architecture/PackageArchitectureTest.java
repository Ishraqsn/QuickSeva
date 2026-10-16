package com.quickseva.api.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

@AnalyzeClasses(
        packages = "com.quickseva.api",
        importOptions = ImportOption.DoNotIncludeTests.class)
class PackageArchitectureTest {
    @ArchTest
    static final ArchRule CONTROLLERS_MUST_NOT_DEPEND_ON_PERSISTENCE = noClasses()
            .that()
            .resideInAPackage("..controller..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..repository..", "..entity..");

    @ArchTest
    static final ArchRule SERVICES_MUST_NOT_DEPEND_ON_CONTROLLERS = noClasses()
            .that()
            .resideInAPackage("..service..")
            .should()
            .dependOnClassesThat()
            .resideInAPackage("..controller..");

    @ArchTest
    static final ArchRule SHARED_CODE_MUST_NOT_DEPEND_ON_FEATURES = noClasses()
            .that()
            .resideInAPackage("com.quickseva.api.common..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("com.quickseva.api.auth..", "com.quickseva.api.application..", "com.quickseva.api.catalog..");
}
