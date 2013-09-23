{
    "compile" : function(options) {
        if (options == undefined) options = {};
        extend(options, { clean:true, source: directories.source, destination: directories.compile_to, java_version:"1.7" });
        if (options.clean) { io.clean(options.destination); }
        var files_to_compile = io.collect(options.source, ".java");
        for (var i = 0; i < files_to_compile.length; i++) {
            var line = "javac -d " + options.destination;
            if (options.classpath != undefined) {
                line += " -classpath " + options.classpath;
            }
            line += " -sourcepath " + options.source + " -source " + options.java_version + " " + files_to_compile[i];
            run_command(line);
        }
        return options.destination;
    }

}