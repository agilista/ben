this.compile = require("compile.js").compile;
this.dependencies = require("dependencies.js");
this.archive = io.archive;
this.packages = require("packages.js");
this.run_tests = require("run_tests.js").run_tests;

Object.freeze(this.compile);
Object.freeze(this.archive);
Object.freeze(this.packages);
Object.freeze(this.run_tests);


this.Ben = {
    "run":function () {
        var scope = {};
        run("config.js", scope);
        var args = [].slice.call(arguments);
        var defaults = require("_module.js");
        var module = require(args[0]);
        override(defaults, module);
        this.add_version_number(defaults);
        this.run_module(defaults, scope);
    },
    "add_version_number":function (module) {
        if (module.version!==undefined && module.version.number === undefined) {
            module.version.number = "0.0.1";
        }
    },
    "run_module":function (module, scope) {
        var all = module.all.call(module);
        for (var i = 0; i < all.length; i++) {
            var current = all[i];
            if (typeof current === "function") {
                current.call(scope, module.name);
            }
        }
    }
};