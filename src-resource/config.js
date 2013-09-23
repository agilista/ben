(function (global) {

    global.directories = {
        "libs_home": io.working_directory() + "/libs",
        "source": "./src",
        "source_resources": "./src-resource",
        "test": "./test",
        "test_resources": "./test-resource",
        "compile_to": "./classes",
        "interim": "./made",
        "distribution": "./dist",
        "config": "./config"
    };

    Object.freeze(global.directories);

})(this);