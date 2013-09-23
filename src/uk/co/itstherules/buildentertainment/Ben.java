package uk.co.itstherules.buildentertainment;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleScriptContext;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

public final class Ben {

    private static final String REPO = "ben.repo";

    public static void main(String... args) throws Throwable {
        setRepoIfNull();
        runBen(args);
    }

    private static void runBen(String... args) throws Exception {
        if(args.length > 0) {
			new Ben(args);
		} else {
    		new Ben("module.js");
        }
    }

    private static void setRepoIfNull() {
        if(System.getProperty(REPO) == null) {
            System.setProperty(REPO, "file:~/.ben/packages/");
        }
    }

    public Ben(String... args) throws Exception {
        ScriptEngine engine = makeEngine();
        addDefaultScripts(engine);
        engine.eval("Ben.run(" + JS.toString(Arrays.asList(args)) + ");");
	}

    private void addDefaultScripts(ScriptEngine engine) throws ScriptException, IOException {
        includeFromClasspath(engine, "io.js");
        includeFromClasspath(engine, "ben.js");
    }

    private ScriptEngine makeEngine() {
        ScriptEngineManager manager = new ScriptEngineManager(Thread.currentThread().getContextClassLoader());
        ScriptEngine engine = manager.getEngineByExtension("js");
        SimpleScriptContext context = new SimpleScriptContext();
        engine.setContext(context);
        return engine;
    }

    private void includeFromClasspath(ScriptEngine engine, String scriptPath) throws ScriptException, IOException {
		InputStream resource = java.lang.Thread.currentThread().getContextClassLoader().getResourceAsStream(scriptPath);
        final BufferedReader reader = new BufferedReader(new InputStreamReader(resource));
        engine.eval(reader);
    }



    static class JS {

        public static final int CONTROL_CHAR_BOUNDARY = 32;
        private static final Map<Character, String> MAP;

        static {
            Map<Character, String> map = new HashMap<Character, String>();
            map.put('\b', "\\b");
            map.put('\n', "\\n");
            map.put('\t', "\\t");
            map.put('\f', "\\f");
            map.put('\r', "\\r");
            map.put('\'', "\\'");
            map.put('"', "\\\"");
            map.put('/', "\\/");
            map.put('\\', "\\\\");
            MAP = Collections.unmodifiableMap(map);
        }

        private JS(){}

        static final String toString(List<String> list) {
            StringBuilder b = new StringBuilder();
            Iterator<String> iterator = list.iterator();
            while(iterator.hasNext()) {
                b.append("'").append(escape(iterator.next())).append("'");
                if(iterator.hasNext()) b.append(", ");
            }
    		return  b.toString();

        }

        static final String escape(String s) {
            if (s == null) {
                throw new IllegalArgumentException("The string should not be null");
            }
            StringBuilder b = new StringBuilder(s.length() * 2);
            for (int i = 0; i < s.length(); i++) {
                char character = s.charAt(i);
                if (character < CONTROL_CHAR_BOUNDARY) {
                    String reply = MAP.get(character);
                    if (reply != null) {
                        b.append(reply);
                    } else {
                        if (character > 0xf) {
                            b.append("\\u00");
                            b.append(hex(character));
                        } else {
                            b.append("\\u000");
                            b.append(hex(character));
                        }
                    }
                }
                else {
                    if (character > 0xfff) {
                        b.append("\\u");
                        b.append(hex(character));
                    } else if (character > 0xff) {
                        b.append("\\u0");
                        b.append(hex(character));
                    } else if (character > 0x7f) {
                        b.append("\\u00");
                        b.append(hex(character));
                    }
                    else {
                        String reply = MAP.get(character);
                        if (reply != null) {
                            b.append(reply);
                        } else {
                            b.append(character);
                        }
                    }
                }
            }
            return b.toString();
        }

        private static String hex(char ch) {
            return Integer.toHexString(ch).toUpperCase();
        }

    }



}