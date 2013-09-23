{
    compile : function (options) {
        if (options == undefined) options = {};
        extend(options, { clean: true, source: dir.source, destination: dir.compileTo, javaVersion: "1.7" });
        if (options.clean) {
            io.clean(options.destination);
        }
        var javaFiles = io.collect(options.source, ".java");
        for (var i = 0; i < javaFiles.length; i++) {
            var commandLine = "javac -d " + options.destination;
            if (options.classpath != undefined) {
                commandLine += " -classpath " + options.classpath;
            }
            commandLine += " -sourcepath " + options.source +
                " -source " + options.javaVersion +
                " " + javaFiles[i];
            command(commandLine);
        }
        return options.destination;
    }
}