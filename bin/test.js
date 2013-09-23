{
    test: {
        junit: function junit(options) {
            if (options == undefined) options = {};
            extend(options, { hamcrest_version:'1.3', junit_version:'4.11' });
            options.classpath += io.pathSeparator + dependencies.classpath(['repo:junit/' + options.junit_version + '/', 'repo:hamcrest/core/' + options.hamcrest_version + '/']);
            var testFile = io.file(options.file);
            var tests = [];
            if (testFile.isDirectory() || io.isJar(testFile)) {
                var classes = io.collect(options.file, '.class');
                for (var i = 0; i < classes.length; i++) {
                    var c = classes[i];
                    if (this.isJUnitTestClass(c, options.classpath)) {
                        tests.push(c);
                    }
                }
            } else if (this.isJUnitTestClass(testFile.getPath(), options.classpath)) {
                tests.push(testFile.getPath());
            }
            var runner = 'org.junit.runner.JUnitCore'; //assume > v3
            if (+(options.version) < 4) {
                runner = 'junit.textui.TestRunner';
            }
            var commandLine = 'java -classpath ' + options.classpath + ' ' + runner;
            for (var i = 0; i < tests.length; i++) {
                var className = this.findClassName(tests[i]);
                commandLine += ' ' + className;
            }
            println(commandLine);
            var reply = command(commandLine);
            if (reply.indexOf('FAILURES!!!') > -1) {
                throw reply
            } else {
                println(reply);
            }
        },

        isJUnitTestClass: function isJUnitTestClass(name, classpath) {

            var makeClassLoaderFromClasspath = function (classpath) {
                var filePaths = classpath.split(io.pathSeparator);
                var urls = [];
                for (var i = 0; i < filePaths.length; i++) {
                    var filePath = filePaths[i];
                    urls[i] = new java.io.File(filePath).toURI().toURL()
                }
                var classLoader = java.net.URLClassLoader.newInstance(urls);
                return classLoader;
            }
            var classLoader = makeClassLoaderFromClasspath(classpath);
            var className = this.findClassName(name);
            var currentClass = java.lang.Class.forName(className, true, classLoader);
            var methods = currentClass.getDeclaredMethods();
            var testClass = java.lang.Class.forName('org.junit.Test', true, classLoader);
            for (var i = 0; i < methods.length; i++) {
                if (methods[i].isAnnotationPresent(testClass)) {
                    return true;
                }
            }
            return false;
        },

        findClassName: function findClassName(name) {
            return name.substring(0, name.lastIndexOf('.class')).replaceAll('/', '.');
        }
    }
}