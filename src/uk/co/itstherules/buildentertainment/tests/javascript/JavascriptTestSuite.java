package uk.co.itstherules.buildentertainment.tests.javascript;

import org.junit.runner.Description;
import uk.co.itstherules.buildentertainment.JavascriptEngine;
import uk.co.itstherules.buildentertainment.tests.javascript.JavascriptTestCase;
import uk.co.itstherules.buildentertainment.tests.javascript.JavascriptTestMethod;
import uk.co.itstherules.buildentertainment.tests.javascript.JavascriptTests;

import javax.script.ScriptException;
import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

final class JavascriptTestSuite {

    private final Class<?> suiteClass;
    private final List<JavascriptTestCase> cases;


    public JavascriptTestSuite(Class<?> suiteClass) {
        this(suiteClass, suiteClass.getAnnotation(JavascriptTests.class).value());
    }

    JavascriptTestSuite(Class<?> suiteClass, String... testCaseNames) {
        this.suiteClass = suiteClass;
        this.cases = makeTestCases(Arrays.asList(testCaseNames));
    }

    public Description getDescription() {
        Description suiteDescription = Description.createSuiteDescription(suiteClass);
        for (JavascriptTestCase testCase : cases) {
            List<JavascriptTestMethod> tests = testCase.getTestMethods();
            String name = testCase.getDotlessName();
            Description testCaseDescription = Description.createTestDescription(name, name);
            suiteDescription.addChild(testCaseDescription);
            for (JavascriptTestMethod test : tests) {
                Description testMethodDescription = Description.createTestDescription(name, test.getMethodName());
                testCaseDescription.addChild(testMethodDescription);
            }
        }
        return suiteDescription;
    }

    public List<JavascriptTestCase> getTestCases() {
        return cases;
    }

    private List<JavascriptTestCase> makeTestCases(List<String> testCaseNames) {
        try {
            List<JavascriptTestCase> testCases = new ArrayList<>();
            for (String testCaseName : testCaseNames) {
                List<JavascriptTestMethod> methods = makeEngineWithDefaults().include(testCaseName);
                testCases.add(new JavascriptTestCase(testCaseName, methods));
            }
            return testCases;
        } catch (ScriptException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    private JavascriptEngine makeEngineWithDefaults() throws ScriptException, IOException {
        JavascriptEngine engine = new JavascriptEngine();
        engine.include("io.js");
        engine.include("junit_test_harness.js");
        return engine;
    }

}