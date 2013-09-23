{
   "graph_as_classpath": function(home, package_object) {
        var paths = [];
        var flatten_graph = function (value, path) {
            if (typeof value === "string") { // assume the end of the path
                paths.push(path += "/" + value);
                path = "";
            }
            if(Object.prototype.toString.call(value) === Object.prototype.toString.call([])) {
                for (var i = 0; i < value.length; i++) {
                    var array_item = value[i];
                    flatten_graph(array_item, path);
                }
                path = "";
            } else if(typeof value === "object") {
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        flatten_graph(value[key], path + "/" + key);
                    }
                }
            }
        };
        flatten_graph(package_object, home);
        var path = paths.join(io.path_separator);
        return path;
    },

    "uris_as_classpath": function(home, uris) {
		var deps = this.find(home, uris);
		var reply = "";
		for(var i = 0; i < deps.length; i++) {
			reply += deps[i];
			if(deps.length-1 != i) { reply += io.path_separator; }
		}
		return reply;
	},

	"find": function(home, uri_paths) {
		var paths = [];
		for (var i = 0; i < uri_paths.length; i++) {
			var path = uri_paths[i];
			if(path.starts_with("file:")) {
				path = path.substring("file:".length);
				var u = io.uri(path);
			} else if(path.starts_with("repo:")) {
				path = path.substring("repo:".length);
				var u = io.uri(home + path);
			} else {
				var u = io.uri(home + path);
			}
            this.read_file(home, u, paths, true);
		}
		return paths;
	},

	"read_directory" : function(home, directory_uri, paths) {
		var directory = io.directory(directory_uri.getPath());
		var files = directory.list();
		for (var i = 0; i < files.length; i++) {
			var path = files[i];
			if (!path.endsWith(".DS_Store")) {
				this.read_file(home, io.uri(directory_uri.getPath() + path), paths, false);
			}
		}
	},

	"read_file" : function(home, uri, paths, dir_to_crawl) {
		var file = io.file(uri.getPath());
		if (!file.exists()) {
			throw "File \"" + file.getAbsolutePath() + "\" does not exist";
		}
		if (io.is_directory(file) && dir_to_crawl) {
			this.read_directory(home, uri, paths);
		} else if (io.is_jar(file)) {
			paths.push(uri);
		} else if (io.is_include(file)) {
			this.read_dependencies_file(home, uri, paths);
		}
	},

	"read_dependencies_file": function(home, uri, paths) {
		var lines = io.lines(uri);
		for ( var i = 0; i < lines.length; i++) {
			var current = io.uri(home + lines[i]);
			this.read_file(home, current, paths, true);
		}
	}
}