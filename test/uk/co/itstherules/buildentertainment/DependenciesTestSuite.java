package uk.co.itstherules.buildentertainment;


import org.junit.runner.RunWith;
import uk.co.itstherules.buildentertainment.tests.javascript.JavascriptTests;
import uk.co.itstherules.buildentertainment.tests.javascript.JavascriptTestRunner;

@JavascriptTests({
    "uk/co/itstherules/buildentertainment/dependencies_test.js"
})
@RunWith(JavascriptTestRunner.class) public final class DependenciesTestSuite {  }