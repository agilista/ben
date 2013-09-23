package uk.co.itstherules.buildentertainment.tests.javascript;

import java.util.List;

final class JavascriptTestCase {

    private final String name;
    private final List<JavascriptTestMethod> methods;

    JavascriptTestCase(String name, List<JavascriptTestMethod> methods) {
        this.name = name;
        this.methods = methods;
    }

    String getName() {
        return name;
    }

    String getDotlessName() {
        return this.getName().replaceAll("\\.", "-");
    }

    List<JavascriptTestMethod> getTestMethods() {
        return methods;
    }

}