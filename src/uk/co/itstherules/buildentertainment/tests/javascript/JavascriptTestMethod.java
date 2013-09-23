package uk.co.itstherules.buildentertainment.tests.javascript;

class JavascriptTestMethod {

    private final String methodName;
    private final Runnable runnable;

    public JavascriptTestMethod(String methodName, Runnable runnable) {
        this.methodName = methodName;
        this.runnable = runnable;
    }

    String getMethodName() {
        return methodName;
    }

    Runnable getRunnable() {
        return runnable;
    }
}