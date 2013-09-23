{
    "write_file": function(directory, file_name, to_write){
        var path = directory + io.separator + file_name;
        var assert_that_the_file_was_written = function() {
            assert.assertTrue("The file '"+path+"' that was supposed to be written hasn't been", io.exists(path));
        };
        var make_a_file_in_the_target_directory = function() {
            var make_target = function() {
                io["delete"](directory);
                io.mkdirs(directory);
            };
            var write_file = function() {
                var writer = io.writer(path);
                writer.write(to_write);
                writer.close();
            };
            make_target();
            write_file();
            assert_that_the_file_was_written();
        };
        make_a_file_in_the_target_directory();
    }


}