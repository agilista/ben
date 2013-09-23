package uk.co.itstherules.buildentertainment.tests.javascript;

import java.lang.annotation.Retention;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Retention(RUNTIME)
public @interface JavascriptTests {
    String[] value();
}