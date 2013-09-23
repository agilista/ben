(function (global) {

    var _cache = {};

    var _copy = function (original, extension, predictate) {
        for (var key in extension) {
            if (predictate(original[key])) {
                original[key] = extension[key];
            }
        }
    };

    var extend = global.extend = function extend(original, extension) {
        _copy(original, extension, function (value) {
            return value == undefined
        });
    };

    var override = global.override = function override(original, extension) {
        _copy(original, extension, function () {
            return true
        });
    };

    var _class = {
        "System":java.lang.System,
        "Class": java.lang.Class,
        "Runtime": java.lang.Runtime,
        "Thread":java.lang.Thread,
        "Array":java.lang.reflect.Array,

        "URLClassLoader": java.net.URLClassLoader,
        "URI": java.net.URI,

        "File":java.io.File,
        "FilenameFilter":java.io.FilenameFilter,
        "FileReader": java.io.FileReader,
        "BufferedReader": java.io.BufferedReader,
        "FileWriter": java.io.FileWriter,
        "BufferedWriter": java.io.BufferedWriter,
        "InputStreamReader": java.io.InputStreamReader,
        "JarFile": java.util.jar.JarFile,
        "ArchiveEntry": function(type) {
            return java.util[type.toLowerCase()][type + 'Entry']
        },
        "ArchiveStream": function(type, direction) {
            return java.util[type.toLowerCase()][type + direction + 'putStream'];
        },
        "Stream": function(type, direction) {
            return java.io[type+direction+"putStream"];
        }
    };

    extend(_class, {
            "ArchiveOutputStream": function(type) {
                return _class.ArchiveStream(type, 'Out');
            },
            "ArchiveInputStream": function(type) {
                return _class.ArchiveStream(type, 'In');
            },
            "FileInputStream": _class.Stream("File", "In"),
            "FileOutputStream": _class.Stream("File", "Out"),
            "BufferedInputStream":_class.Stream("Buffered", "In"),
            "BufferedOutputStream": _class.Stream("Buffered", "Out")
        });

    var _byte_array = function (size) {
        return _class.Array.newInstance(java.lang.Byte.TYPE, size);
    };

    var _archive = function (options, type) {
        if (options == undefined) options = {};
        extend(options, { destination: directories.interim, name:'File.' + type, roots:[directories.compile_to] });
        if (options.clean) {
            io.clean(options.destination);
        }

        var buffer_size = 2048;

        var walk_file_system = function (file, root, output) {
            var array_buffer = _byte_array(buffer_size);
            var files = io.list_files(file);
            for (var i = 0; i < files.length; i++) {
                var current_file = files[i];
                if (io.is_directory(current_file)) {
                    walk_file_system(current_file, root, output);
                } else {
                    if (!io.file_name(current_file).contains('.DS_Store')) {
                        var origin = new _class.BufferedInputStream(new _class.FileInputStream(current_file), buffer_size);
                        var path = current_file.getPath().substring(root.length + 1);
                        output.putNextEntry(new _class.ArchiveEntry(type)(path));
                        var count = 0;
                        while ((count = origin.read(array_buffer, 0, buffer_size)) != -1) {
                            output.write(array_buffer, 0, count);
                        }
                        origin.close();
                    }
                }
            }
        };

        io.mkdirs(options.destination);
        var name = options.destination + io.separator + options.name;
        var output = new _class.ArchiveOutputStream(type)(new _class.FileOutputStream(name));
        for (var i = 0; i < options.roots.length; i++) {
            var root = options.roots[i];
            var file = io.file(root);
            walk_file_system(file, root, output);
        }
        output.close();
    };

    var run = global.run = function run(uri, scope) {
        var s = scope || {};
        var string = io.uri_to_string(uri);
        var f = new Function(string);
        f.call(s);
    };

    var require = global.require = function require(uri) {
        if (typeof arguments[0] !== 'string') {
            throw 'USAGE: require(module_uri)';
        }
        if (_cache[uri] === undefined) {
            try {
                var extend_function_as_string = 'extend(exports, ' + io.uri_to_string(uri) + ');';
            } catch (e) {
                throw 'Unable to read file: ' + uri;
            }

            if (extend_function_as_string) {
                try {
                    var f = new Function('require', 'exports', 'module', extend_function_as_string);
                    var exports = {};
                    var module = { uri:uri, exports:exports };
                    f.call({}, require, exports, module);
                } catch (e) {
                    throw 'Unable to require source code from "' + uri + '": ' + e.toSource();
                }
                exports = module.exports || exports;
            } else {
                throw 'The requested module cannot be returned: no content for uri: "' + uri + '"';
            }
            _cache[uri] = exports;
            return exports;
        } else {
            return _cache[uri];
        }
    };

    var io = global.io = {

        "separator": _class.File.separator,
        "path_separator": _class.File.pathSeparator,
        "line_separator": _class.System.getProperty('line.separator'),
        "out": _class.System.out,
        "error": _class.System.err,

        "archive":{
            jar: function (options) {
                _archive(options, "Jar");
            },
            zip: function (options) {
                _archive(options, "Zip");
            },
            unzip: function(file, destination) {
                var buffer_size = 2048;
                var array_buffer = _byte_array(buffer_size);
                var zip_file = io.file(file);
                var target_directory = io.file(destination);
                io.mkdirs(target_directory);
                var input = new _class.ArchiveInputStream("Zip")(new _class.FileInputStream(zip_file));
                var entry = input.getNextEntry();
                while(entry != null) {
                    var name = entry.getName();
                    var target_file = io.file(io.absolute_path(target_directory)+io.separator+name);
                    io.mkdirs(target_file.getParent());
                    var output = new _class.FileOutputStream(target_file);
                    var length;
                    while((length = input.read(array_buffer)) > 0) {
                        output.write(array_buffer, 0, length);
                    }
                    output.close();
                    entry = input.getNextEntry();
                }
                input.closeEntry();
                input.close();
            }
        },

        "class_in_classpath":function class_in_classpath(class_name, classpath) {
            var class_loader = io.class_loader_from_classpath(classpath);
            return _class.Class.forName(class_name, true, class_loader);
        },

        "class_loader_from_classpath": function class_loader_from_classpath(classpath) {
            var filePaths = classpath.split(io.path_separator);
            var urls = [];
            for (var i = 0; i < filePaths.length; i++) {
                var filePath = filePaths[i];
                urls[i] = io.file(filePath).toURI().toURL();
            }
            return _class.URLClassLoader.newInstance(urls);
        },

        "uri":function uri(uri_string) {
            return new _class.URI(uri_string);
        },

        "file":function file(path_string) {
            if(io.is_file(path_string)) { return path_string; }
            return new _class.File(path_string);
        },

        "directory":function directory(path_string) {
            var directory = io.file(path_string);
            if (!io.is_directory(directory)) {
                throw "\"" + io.absolute_path(directory) + "\" is not a directory";
            }
            return directory;
        },

        "absolute_path":function (file) {
            return io.file(file).getAbsolutePath();
        },

        "reader": function reader(uri_string) {
            if(io.is_reader(uri_string)) { return uri_string; }
            var resource = _class.Thread.currentThread().getContextClassLoader().getResourceAsStream(uri_string);
            if (resource == null) {
                return new _class.BufferedReader(new _class.FileReader(uri_string));
            }
            return new _class.BufferedReader(new _class.InputStreamReader(resource));
        },

        "writer": function reader(uri_string) {
            return new _class.BufferedWriter(new _class.FileWriter(uri_string));
        },

        "file_name":function file_name(file) {
            return io.file(file).getName();
        },

        "is_include":function is_include(file) {
            return "include" == io.file_name(io.file(file));
        },

        "is_jar":function is_jar(file) {
            return io.absolute_path(io.file(file)).endsWith(".jar");
        },

        "is_directory":function is_directory(file) {
            return io.file(file).isDirectory();
        },

        "is_file":function is_file(file) {
            return typeof file.isFile === "function" && file.isFile();
        },

        "is_reader": function(uri_string){
            return (uri_string !== undefined && typeof uri_string.read  === "function");
        },

        "exists": function(file){
            var f = io.file(file);
            return f.exists !== undefined && f.exists();
        },

        "clean": function clean(file) {
            var dest = io.file(file);
            if (io.exists(dest)) {
                this["delete"](dest);
            }
            io.mkdirs(file);
        },

        "mkdirs": function mkdirs(file) {
            io.file(file).mkdirs();
        },

        "lines": function lines(reader) {
            var lines = [];
            io.visit_file(reader, function (line) {
                lines.push(line);
            });
            return lines;
        },

        "working_directory": function working_directory() {
            return _class.System.getProperty("user.dir");
        },

        "collect": function collect(source, extension) {
            var recurse_jar = function (file, collector) {
                var jarFile = new _class.JarFile(file);
                var entries = jarFile.entries();
                while (entries.hasMoreElements()) {
                    var entry = entries.nextElement();
                    var path = entry.getName();
                    if (!io.is_directory(entry) && (extension == undefined || path.endsWith(extension))) {
                        collector.push(path);
                    }
                }
                return collector;
            };
            var recurse_dir = function (dir, collector) {
                var files = io.list_files(dir);
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var path = file.getPath();
                    if (io.is_directory(file)) {
                        recurse_dir(file, collector);
                    } else if (extension == undefined || path.endsWith(extension)) {
                        collector.push(path);
                    }
                }
                return collector;
            };
            var file = io.file(source);
            if (io.is_jar(file)) { return recurse_jar(file, []); }
            if (io.is_directory(file)) return recurse_dir(file, []);
            return [];
        },

        "delete": function (path) {
            var file = io.file(path);
            io.delete_file(file);
            io.delete_dir(file);
        },

        "delete_file": function delete_file(file) {
            if (file === undefined) { throw "File has not been defined"; }
            var f = io.file(file);
            if (io.is_file(f) && ".DS_Store" != io.file_name(f)) {
                f["delete"]();
            }
        },

        "delete_dir": function delete_dir(directory) {
            if (directory === undefined) { throw "Directory has not been defined"; }
            var f = io.file(directory);
            if (io.is_directory(f)) {
                var files = io.list_files(f);
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    io.delete_dir(file);
                    io.delete_file(file);
                }
                f["delete"]();
            }
        },

        "clean":function clean(path) {
            io["delete"](path);
            io.mkdirs(path);
        },

        "copy":function copy(source, destination, filter) {
            var file = io.file(source);
            if (io.is_directory(file)) {
                io.copy_directory(source, destination, filter)
            } else {
                io.copy_file(source, destination)
            }
        },

        "copy_file":function copy_file(source_path, destination_path) {
            var inp = new _class.FileInputStream(source_path);
            var out = new _class.FileOutputStream(destination_path);
            var buf = _byte_array(1024);
            var len;
            while ((len = inp.read(buf)) > 0) {
                out.write(buf, 0, len);
            }
            inp.close();
            out.close();
        },

        "copy_directory":function copy_directory(source_path, destination_path, filter) {
            var source = io.file(source_path);
            var destination = io.file(destination_path);
            if (!io.exists(destination)) {
                io.mkdirs(destination)
            }
            var children = io.list(source, filter);
            for (var i = 0; i < children.length; i++) {
                io.copy(io.file(source + "/" + children[i]), io.file(destination + "/" + children[i]));
            }
        },

        "list": function(directory, filter) {
            if(filter !== undefined){
                if(typeof filter.accept !== "function") {
                    throw "In order to apply a filter, the object must have an 'accept' function which takes a dir " +
                        "and filename";
                }
                return directory.list(new _class.FilenameFilter(filter));
            }
            return directory.list();
        },

        "list_files": function(directory) {
            return io.file(directory).listFiles();
        },

        "visit_file":function visit_file(reader, visitor) {
            var line = "";
            var reader = io.reader(reader);
            while ((line = reader.readLine()) != null) {
                visitor(line);
            }
            reader.close();
        },

        "uri_to_string":function uri_to_string(uri) {
            return io.reader_to_string(io.reader(uri));
        },

        "reader_to_string":function reader_to_string(reader) {
            var reply = "";
            io.visit_file(reader, function (line) {
                reply += line + io.line_separator;
            });
            return reply
        },

        "stream_to_string":function stream_to_string(input_stream) {
            var input_reader = new _class.BufferedReader(new _class.InputStreamReader(input_stream));
            return io.reader_to_string(input_reader);
        }

    };

    var run_command = global.run_command = function (command) {
        var reply = _class.Runtime.getRuntime().exec(command);
        var errorString = io.stream_to_string(reply.getErrorStream());
        if (errorString != "") {
            throw errorString;
        }
        return io.stream_to_string(reply.getInputStream());
    };

    if (typeof String.prototype.starts_with !== "function") {
        String.prototype.starts_with = function (prefix, offset_index) {
            return this.indexOf("file:") === (offset_index || 0);
        };
    }

    if (typeof String.prototype.ends_with !== "function") {
        String.prototype.ends_with = function (suffix) {
            var offset_index = this.length - suffix.length;
            if (offset_index < 0) return false;
            return this.starts_with(suffix, offset_index);
        };
    }

    run("config.js", this);
    run("logger.js", this);

    Object.freeze(extend);
    Object.freeze(override);
    Object.freeze(run);
    Object.freeze(require);
    Object.freeze(io);
    Object.freeze(run_command);

})(this);