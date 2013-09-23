package uk.co.itstherules.buildentertainment;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleScriptContext;
import java.io.*;

public final class JavascriptEngine {

    private final ScriptEngine engine;

    public JavascriptEngine(){
        ScriptEngineManager manager = new ScriptEngineManager(Thread.currentThread().getContextClassLoader());
        engine = manager.getEngineByExtension("js");
        SimpleScriptContext context = new SimpleScriptContext();
        engine.setContext(context);
    }

    @SuppressWarnings("unchecked")
    public <T> T include(String scriptPath) throws ScriptException, IOException {
        InputStream resource = Thread.currentThread().getContextClassLoader().getResourceAsStream(scriptPath);
        if(resource==null) {
            throw new FileNotFoundException(scriptPath+ " cannot be found");
        }
        return (T) engine.eval(new BufferedReader(new InputStreamReader(resource)));
    }

    public void eval(String s) throws ScriptException {
        engine.eval(s);
    }
}
