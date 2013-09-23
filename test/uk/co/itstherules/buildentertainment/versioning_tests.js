tests({

    "the version gets a fixed value each build if fixed": function() {
        var build_configuration = {
            "name": "demo_config",
            "version": { "system": "fixed", "number":"0.0.9" }
        };
        var scope = {};
        run("ben.js",scope);
        scope.Ben.add_version_number(build_configuration);
        assert.assertEquals("0.0.9", build_configuration.version.number);
    }

    /*
    ,

    "the version is 0.0.1 if no version number supplied": function() {
        var build_configuration = {
            "name": "demo_config",
            "version": { "system": "fixed" }
        };
        var scope = {};
        run("ben.js",scope);
        scope.Ben.add_version_number(build_configuration);
        assert.assertEquals("0.0.1", build_configuration.version.number);
    }
    */

})