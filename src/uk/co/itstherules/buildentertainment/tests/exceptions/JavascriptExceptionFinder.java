package uk.co.itstherules.buildentertainment.tests.exceptions;

import java.lang.reflect.Field;

public final class JavascriptExceptionFinder {

    private JavascriptExceptionFinder() {}

    public static Throwable findBestException(Throwable e) {
        if (isNashornException(e))
            return e.getCause() != null ? e.getCause() : e;
        if (isRhinoException(e)) {
            return extractActualException(e);
        }
        return e;
    }

    private static boolean isRhinoException(Throwable e) {
        return e.getClass().getSimpleName().contains("JavaScript");
    }

    private static boolean isNashornException(Throwable e) {
        return e.getClass().getSimpleName().contains("ECMA");
    }

    private static Throwable extractActualException(Throwable e) {
        try {
            Field f = e.getClass().getDeclaredField("value");
            f.setAccessible(true);
            Object javascriptWrapper = f.get(e);
            Field javaThrowable = javascriptWrapper.getClass().getDeclaredField("javaObject");
            javaThrowable.setAccessible(true);
            Throwable t = (Throwable) javaThrowable.get(javascriptWrapper);
            return t;
        } catch (NoSuchFieldException | SecurityException | IllegalArgumentException | IllegalAccessException e1) {
            throw new RuntimeException(e);
        }
    }

}