(function (global) {

    global.assert = Packages.org.junit.Assert;

    global.tests = function (testInstance) {
        var TestMethod = Packages.uk.co.itstherules.buildentertainment.tests.javascript.JavascriptTestMethod;
        var methods = new java.util.ArrayList();
        for (var name in testInstance) {
            if (testInstance.hasOwnProperty(name)) {
                methods.add(new TestMethod(name, testInstance[name]));
            }
        }
        return methods;
    };


})(this)