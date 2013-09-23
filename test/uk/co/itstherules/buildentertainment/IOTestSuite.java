package uk.co.itstherules.buildentertainment;


import org.junit.runner.RunWith;
import uk.co.itstherules.buildentertainment.tests.javascript.JavascriptTests;
import uk.co.itstherules.buildentertainment.tests.javascript.JavascriptTestRunner;

@JavascriptTests({
    "uk/co/itstherules/buildentertainment/extend_override_run_require_io_tests.js",
    "uk/co/itstherules/buildentertainment/io_tests.js"
})
@RunWith(JavascriptTestRunner.class) public final class IOTestSuite {}