package uk.co.itstherules.buildentertainment.tests.javascript;

import org.junit.runner.Description;
import org.junit.runner.Runner;
import org.junit.runner.manipulation.*;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunNotifier;
import uk.co.itstherules.buildentertainment.tests.exceptions.JavascriptExceptionFinder;

import java.util.List;

public final class JavascriptTestRunner extends Runner implements Filterable, Sortable {

    private final JavascriptTestSuite testSuite;

    public JavascriptTestRunner(Class<?> suiteClass) {
        testSuite = new JavascriptTestSuite(suiteClass);
    }

    @Override
    public Description getDescription() {
        return testSuite.getDescription();
    }

    @Override
    public void run(RunNotifier notifier) {
        for (JavascriptTestCase testCase : testSuite.getTestCases()) {
            List<JavascriptTestMethod> testMethods = testCase.getTestMethods();
            for (JavascriptTestMethod testMethod : testMethods) {
                Description description = Description.createTestDescription(testCase.getDotlessName(), testMethod.getMethodName());
                notifier.fireTestStarted(description);
                try {
                    testMethod.getRunnable().run();
                    notifier.fireTestFinished(description);
                } catch (Exception | Error e) {
                    notifier.fireTestFailure(new Failure(description, JavascriptExceptionFinder.findBestException(e)));
                }
            }
        }
    }

    public void sort(Sorter sorter) { }

    public void filter(Filter filter) throws NoTestsRemainException { }
}