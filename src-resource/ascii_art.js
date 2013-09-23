{
    "_get_me_a": function(file_name, message) {
    var cute_ascii = io.uri_to_string(file_name+".txt");
    return  cute_ascii +
        "\n" +
        "\n" +
        message +
        "\n" +
        "\n";

    },
    "cowboy": function(message) {
        return this._get_me_a("cowboy", message);
    },
    "purrfect": function(message) {
        return this._get_me_a("purrfect", message);
    },
    "doh": function(message) {
        return this._get_me_a("doh", message);
    }

}