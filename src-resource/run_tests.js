{
    "run_tests": {

        "junit": function junit(options) {
            if (options == undefined) options = {};
            var classpath = options.classpath + io.path_separator + dependencies.graph_as_classpath(
                directories.libs_home, packages.unit_test);
            var test_file = options.file;
            var command_line = ["java", "-classpath", classpath, "org.junit.runner.JUnitCore"];
            var tests = this.collect_junit_tests(test_file, classpath);
            var ascii = require("ascii_art.js");
            if(tests.length > 0) {
                command_line = command_line.concat(tests);
                var command_line_as_string = command_line.join(" ");
                logger.debug("Running command line: '"+ command_line_as_string+"'");
                var reply = run_command(command_line_as_string);
                if (reply.indexOf("FAILURES!!!") > -1) {
                    throw reply
                } else {
                    logger.info(reply);
                    logger.info(ascii.purrfect("Everything is purrfect - have a kitten!"));
                }
            } else {
                logger.info(ascii.cowboy("Are you on yer lonesome there cowboy? No tests were found."));
            }
        },


        "collect_junit_tests": function(test_file, classpath) {

            var add_test_if_appropriate = function(context, tests, current_class, classpath) {
                if (context.is_test(current_class, classpath)) {
                    var class_name = context.find_class_name(current_class);
                    tests.push(class_name);
                } else if (context.is_test_with_custom_runner(current_class, classpath)) {
                    var class_name = context.find_class_name(current_class);
                    tests.push(class_name);
                }
            };

            var tests = [];
            var absolute_path = io.absolute_path(test_file);
            if (io.is_directory(test_file) || io.is_jar(test_file)) {
                var classes = io.collect(absolute_path, ".class");
                for (var i = 0; i < classes.length; i++) {
                    var current_class = classes[i];
                    add_test_if_appropriate(this, tests, current_class, classpath);
                }
            } else {
                add_test_if_appropriate(this, tests, absolute_path, classpath);
            }
            logger.debug("Found the following test files: " + tests.join(" "));
            return tests;
        },

        "is_test": function(name, classpath) {
            var class_name = this.find_class_name(name);
            logger.debug("Checking to see if " + class_name + " is a junit test...")
            var current_class = io.class_in_classpath(class_name, classpath);
            var test_annotation_class = io.class_in_classpath("org.junit.Test", classpath);
            var class_methods = current_class.getDeclaredMethods();
            for (var i = 0; i < class_methods.length; i++) {
                if (class_methods[i].isAnnotationPresent(test_annotation_class)) {
                    logger.debug(class_name + " IS a standard junit test")
                    return true;
                }
            }
            logger.debug(class_name + " IS NOT a standard junit test")
            return false;
        },

        "is_test_with_custom_runner": function(name, classpath) {
            var class_name = this.find_class_name(name);
            logger.debug("Checking to see if " + class_name + " is a junit test with an explicitly named runner")
            var current_class = io.class_in_classpath(class_name, classpath);
            var test_annotation_class = io.class_in_classpath("org.junit.runner.RunWith", classpath);
            if (current_class.isAnnotationPresent(test_annotation_class)) {
                logger.debug(class_name + " IS a junit test with an explicitly named runner")
                return true;
            }
            logger.debug(class_name + " IS NOT a junit test with an explicitly named runner")
            return false;
        },

        "find_class_name": function(name) {
            logger.debug("Trying to find the class name for: '"+name+"'");
            var reply = name.substring(0, name.lastIndexOf(".class")).replaceAll("/", ".");
            logger.debug("Found the class name: '"+reply+"'");
            return reply;
        }

    }
}