package uk.co.itstherules.buildentertainment;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class BenTest {

    @Test(expected = IllegalArgumentException.class)
    public void throwWithNull() {
        Ben.JS.escape(null);
    }

    @Test
    public void worksWithEmptyString() {
        assertThat(Ben.JS.escape(""), is(""));
    }

    @Test
    public void b() {
        assertThat(Ben.JS.escape("\b"), is("\\b"));
    }

    @Test
    public void n() {
        assertThat(Ben.JS.escape("\n"), is("\\n"));
    }

    @Test
    public void f() {
        assertThat(Ben.JS.escape("\f"), is("\\f"));
    }

    @Test
    public void r() {
        assertThat(Ben.JS.escape("\r"), is("\\r"));
    }

    @Test
    public void t() {
        assertThat(Ben.JS.escape("\t"), is("\\t"));
    }

    @Test
    public void backslash() {
        assertThat(Ben.JS.escape("\\"), is("\\\\"));
    }

    @Test
    public void unicode() {
        assertThat(Ben.JS.escape("\u007e"), is("~"));
        assertThat(Ben.JS.escape("\u0080"), is("\\u0080"));
        assertThat(Ben.JS.escape("\u00f1"), is("\\u00F1"));
        assertThat(Ben.JS.escape("\u00fa"), is("\\u00FA"));
        assertThat(Ben.JS.escape("\u0ffa"), is("\\u0FFA"));
        assertThat(Ben.JS.escape("\ufffb"), is("\\uFFFB"));
    }

    @Test
    public void quiteSimple() {
        assertThat(Ben.JS.escape("He didn't say, \"stop!\""), is("He didn\\'t say, \\\"stop!\\\""));
    }

    @Test
    public void aBitMoreComplex() {
        assertThat(Ben.JS.escape("document.getElementById(\"test\").value = '<script>alert('aaa');</script>';"),
                is("document.getElementById(\\\"test\\\").value = \\'<script>alert(\\'aaa\\');<\\/script>\\';"));
    }

	
}
