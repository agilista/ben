(function (global) {
    global.logger = {
        "debug": function (message) {
            io.out.println(message);
        },
        "info": function (message) {
            io.out.println(message);
        },
        "error": function (message) {
            io.error.println(message);
        }
    };
    Object.freeze(global.logger);
})(this);
