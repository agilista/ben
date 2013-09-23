tests({

    "can find file": function() {
        var reply = io.file("test-resource/im_a_directory/im_a_file.txt");
        assert.assertNotNull("expected file to be found", reply);
    },

    "throws when its a directory not a file": function() {
        try {
            io.directory("test-resource/im_a_directory");
        } catch(e) {
            assert.assertTrue(e.indexOf("test-resource/im_a_directory\" is not a file") > -1);
        }
    },

    "exists": function() {
        var reply = io.exists("test-resource/im_a_directory/im_a_file.txt");
        assert.assertTrue("expected to be a file", reply);
    },

    "doesn't exist": function() {
        var reply = io.exists("test-resource/i_dont_exist");
        assert.assertFalse("expected not to exist", reply);
    },

    "is file": function() {
        var reply = io.is_file(io.file("test-resource/im_a_directory/im_a_file.txt"));
        assert.assertTrue("expected to be a file", reply);
    },

    "isn't file": function() {
        var reply = io.is_file(io.file("test-resource/im_a_directory"));
        assert.assertFalse("expected not to be a file", reply);
    },

    "isn't file as it's a string": function() {
        var reply = io.is_file("im_a_string");
        assert.assertFalse("expected not to be a file", reply);
    },

    "can find directory": function() {
        var dir = io.directory("test-resource/im_a_directory");
        assert.assertNotNull("expected directory to be found", dir);
    },

    "throws when its a file not a directory": function() {
        try {
            io.directory("test-resource/im_a_directory/im_a_file.txt");
        } catch(e) {
            assert.assertTrue(e.indexOf("test-resource/im_a_directory/im_a_file.txt\" is not a directory") > -1);
        }
    },

    "throws when the directory doesn't exist": function() {
        try {
            io.directory("test-resource/i_dont_exist");
        } catch(e) {
            assert.assertTrue(e.indexOf("test-resource/i_dont_exist\" is not a directory") > -1);
        }
    },

    "can make classpath": function() {
        var class_loader = io.class_loader_from_classpath("test-resource/classpath_load_me");
        var reply = class_loader.getResourceAsStream("i/am/a/package/readme.txt");
        assert.assertNotNull("expected the class loader to find the file", reply);
        reply.close();
    },

    "can make and delete a directory": function() {
        io["delete"]("test_target");
        assert.assertFalse("test_target exists when it shouldn't", io.exists("test_target"));
        io.mkdirs("test_target");
        assert.assertTrue("test_target is not a directory", io.is_directory("test_target"));
        assert.assertTrue("test_target does not exist", io.exists("test_target"));
        io["delete"]("test_target");
    },

    "can make and delete a file": function() {
        var dir = "test_target", file = "new_file.txt", path = dir + io.separator + file;

        var write_file = require("uk/co/itstherules/buildentertainment/helper.js").write_file;
        write_file(dir, file, "some content");

        io.delete_file(path);
        assert.assertFalse(io.exists(path));
        io["delete"](dir);
    },

    "deleting a non existing file fails silently": function() {
        io.delete_file("i_dont_exist.txt");
    },

    "deleting a file instead of dir fails silently": function() {
        var dir = "test_target", file = "new_file.txt", path = dir + io.separator + file;
        var write_file = require("uk/co/itstherules/buildentertainment/helper.js").write_file;
        write_file(dir, file, "some content");

        io.delete_dir(path);
        assert.assertTrue("Expected file to still be there", io.exists(io.file(path)));
        io["delete"](dir);
        assert.assertFalse("Expected directory to be blatted", io.exists(io.file(dir)));
    },

    "can read a one line file": function() {
        var dir = "test_target", file = "new_file.txt", path = dir + io.separator + file;
        var write_file = require("uk/co/itstherules/buildentertainment/helper.js").write_file;
        var first_line = "this is the first line";
        write_file(dir, file, first_line);

        var reply = io.lines(path);
        assert.assertEquals(1, reply.length, 0.001);
        assert.assertEquals(first_line, reply[0]);
        io["delete"](dir);
        assert.assertFalse("Expected directory to be blatted", io.exists(io.file(dir)));
    },

    "can read a multi-line file": function() {
        var dir = "test_target", file = "new_file.txt", path = dir + io.separator + file;
        var write_file = require("uk/co/itstherules/buildentertainment/helper.js").write_file;
        var first_line = "this is the first line";
        var second_line = "this is another line";
        var s = io.line_separator;
        write_file(dir, file, first_line+s+second_line);

        var reply = io.lines(path);
        assert.assertEquals(2, reply.length, 0.001);
        assert.assertEquals(first_line, reply[0]);
        assert.assertEquals(second_line, reply[1]);
        io["delete"](dir);
        assert.assertFalse("Expected directory to be blatted", io.exists(io.file(dir)));
    },

    "deleting a dir instead of file fails silently": function() {
        var target = "test_target";
        io.mkdirs(target);
        io.delete_file(target);
        assert.assertTrue("Expected target still be there", io.exists(io.file(target)));
        io["delete"](target);
        assert.assertFalse("Expected target to be cleaned", io.exists(io.file(target)));
    },

    "deleting a non existing dir fails silently": function() {
        io.delete_dir("i_dont_exist");
    },

    "can clean directory": function() {
        var dir = "test_target", file = "new_file.txt", path = dir + io.separator + file;
        var when_there_is_a_file_in_the_target_directory = function() {
            var write_file = require("uk/co/itstherules/buildentertainment/helper.js").write_file;
            write_file(dir, file, "some content");
        };
        var i_clean_the_directory = function() {
            io.clean(dir);
        };
        var assert_the_dir_still_exists_but_the_file_doesnt = function() {
            assert.assertTrue(io.exists(dir));
            assert.assertFalse(io.exists(file));
        };
        var tear_down = function() {
            io["delete"](dir);
        };

        when_there_is_a_file_in_the_target_directory();
        i_clean_the_directory();
        assert_the_dir_still_exists_but_the_file_doesnt();

        tear_down();
    },

    "can collect files in jar": function() {
        var reply = io.collect("test-resource/TestMe.jar", "js");
        assert.assertEquals(3, reply.length, 0.001);
        assert.assertEquals("uk/co/itstherules/buildentertainment/require_chain.js", reply[0]);
        assert.assertEquals("uk/co/itstherules/buildentertainment/to_require.js", reply[1]);
        assert.assertEquals("uk/co/itstherules/buildentertainment/to_run.js", reply[2]);

        var reply = io.collect("test-resource/TestMe.jar", "txt");
        assert.assertEquals(2, reply.length, 0.001);
        assert.assertEquals("uk/co/itstherules/buildentertainment/archive_me/lower_dir/sub_file.txt", reply[0]);
        assert.assertEquals("uk/co/itstherules/buildentertainment/archive_me/main_file.txt", reply[1]);
    },

    "can collect files in directory": function() {
        var reply = io.collect("test-resource/uk", "js");
        assert.assertEquals(3, reply.length, 0.001);
        assert.assertEquals("test-resource/uk/co/itstherules/buildentertainment/to_run.js", reply[0]);
        assert.assertEquals("test-resource/uk/co/itstherules/buildentertainment/to_require.js", reply[1]);
        assert.assertEquals("test-resource/uk/co/itstherules/buildentertainment/require_chain.js", reply[2]);

        var reply = io.collect("test-resource/uk", "txt");
        assert.assertEquals(2, reply.length, 0.001);
        assert.assertEquals("test-resource/uk/co/itstherules/buildentertainment/archive_me/lower_dir/sub_file.txt", reply[0]);
        assert.assertEquals("test-resource/uk/co/itstherules/buildentertainment/archive_me/main_file.txt", reply[1]);
    },

    "can unzip up a zip file": function(){
        io["delete"]("test_target");
        assert.assertFalse("main_file.txt exists when it shouldn't", io.exists("test_target/test_zip_file/main_file.txt"));
        assert.assertFalse("sub_file.txt exists when it shouldn't", io.exists("test_target/test_zip_file/lower_dir/sub_file.txt"));

        io.archive.unzip("test-resource/uk/co/itstherules/buildentertainment/archived/test_zip_file.zip", "test_target/test_zip_file");

        assert.assertTrue("main_file.txt does not exist", io.exists("test_target/test_zip_file/main_file.txt"));
        assert.assertTrue("sub_file.txt does not exist", io.exists("test_target/test_zip_file/lower_dir/sub_file.txt"));
        io["delete"]("test_target");
    },
    "can jar up some files, unzip and check the files": function() {
        io["delete"]("test_target");
        assert.assertFalse("test_jar_file.jar exists", io.exists("test_target/test_jar_file.jar"));
        io.archive.jar({
            "destination":"test_target",
            "name":"test_jar_file.jar",
            "roots":["test-resource/uk/co/itstherules/buildentertainment/archive_me"]
        });
        assert.assertTrue("test_jar_file.jar does not exist", io.exists("test_target/test_jar_file.jar"));
        io.archive.unzip("test_target/test_jar_file.jar", "test_target/test_jar_file");
        assert.assertTrue("main_file.txt does not exist", io.exists("test_target/test_jar_file/main_file.txt"));
        assert.assertTrue("sub_file.txt does not exist", io.exists("test_target/test_jar_file/lower_dir/sub_file.txt"));
        io["delete"]("test_target");
        assert.assertFalse(io.exists("test_target/test_jar_file.jar"));
    },
    "can zip up some files, unzip and check the files": function() {
        io["delete"]("test_target");
        assert.assertFalse("test_zip_file.zip exists", io.exists("test_target/test_zip_file.zip"));
        io.archive.zip({
            "destination":"test_target",
            "name":"test_zip_file.zip",
            "roots":["test-resource/uk/co/itstherules/buildentertainment/archive_me"]
        });
        assert.assertTrue("test_zip_file.zip does not exist", io.exists("test_target/test_zip_file.zip"));
        io.archive.unzip("test_target/test_zip_file.zip", "test_target/test_zip_file");
        assert.assertTrue("main_file.txt does not exist", io.exists("test_target/test_zip_file/main_file.txt"));
        assert.assertTrue("sub_file.txt does not exist", io.exists("test_target/test_zip_file/lower_dir/sub_file.txt"));
        io["delete"]("test_target");
        assert.assertFalse(io.exists("test_target/test_zip_file.zip"));
    }

});