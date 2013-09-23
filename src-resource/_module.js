{
	"name": "ChangeMe",

    "version": { "system": "auto_incrementing" },

	"all": function() {
        return [ this.make, this.test, this.save ];
    },
	
	"make": function(module_name) {

        var _make_jar = function(module_name) {
            logger.info("Compiling source");
            compile({"classpath":dependencies.graph_as_classpath(directories.libs_home, packages.unit_test)});
            io.copy(directories.source_resources, directories.compile_to);
            logger.info("Jarring compiled source");
            io.archive.jar({ clean: true, name: module_name+".jar" });
        };

        var _make_test_jar = function(module_name) {
            logger.info("Compiling tests");
            var cp = dependencies.graph_as_classpath(directories.libs_home, packages.unit_test) + io.path_separator + dependencies.uris_as_classpath(directories.libs_home,[ "file:"+directories.interim+"/" ]);
            logger.debug("Using classpath: "+cp);
            compile({ source: directories.test, classpath: cp});
            io.copy(directories.test, directories.compile_to, { "accept": function(dir, name) { return io.is_directory(dir) || (name && name.endsWith(".js")); }});
            io.copy(directories.test_resources, directories.compile_to);
            logger.info("Jarring tests");
            io.archive.jar({ name: module_name+"_tests.jar" });
        };

        _make_jar(module_name);
        _make_test_jar(module_name);
	},

	"test": function(module_name) {
        logger.info("Running tests")
        var cp = dependencies.uris_as_classpath(directories.libs_home,[ "file:"+directories.interim+"/" ]);
        run_tests.junit({ file: directories.interim+"/"+module_name+"_tests.jar", classpath: cp });
	},
	
	"save": function(module_name) {
        io.clean(directories.distribution);
        io.archive.zip({ clean: true, destination: directories.distribution, name: module_name+".zip", roots: [ directories.interim, directories.config ] });
	}

}