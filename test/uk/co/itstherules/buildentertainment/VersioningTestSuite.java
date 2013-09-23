package uk.co.itstherules.buildentertainment;


import org.junit.runner.RunWith;
import uk.co.itstherules.buildentertainment.tests.javascript.JavascriptTestRunner;
import uk.co.itstherules.buildentertainment.tests.javascript.JavascriptTests;

@JavascriptTests({
    "uk/co/itstherules/buildentertainment/versioning_tests.js"
})
@RunWith(JavascriptTestRunner.class) public final class VersioningTestSuite {}