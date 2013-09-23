var dependencies = require("dependencies.js");

tests({
    "can_print_string":function () {
        var reply = dependencies.graph_as_classpath("/my_homie", "my_homette");
        assert.assertEquals("/my_homie/my_homette", reply);
    },
    "can_print_really_simple_graph":function () {
        var reply = dependencies.graph_as_classpath('/my_homie', {"im":{"an":"object_graph"}});
        assert.assertEquals("/my_homie/im/an/object_graph", reply);
    },
    "can_print_2_simple_graphs":function () {
        var reply = dependencies.graph_as_classpath('/my_home_boy', {"hamcrest":{"1.3":"hamcrest-fall.jar"}, "junit":{"4.11":"junit.jar"}});
        assert.assertEquals("/my_home_boy/hamcrest/1.3/hamcrest-fall.jar" + io.path_separator + "/my_home_boy/junit/4.11/junit.jar", reply);
    },
    "can_print_a_few_string_arrays": function() {
        var reply = dependencies.graph_as_classpath('/my_home_boy', ["fred", "betty", "wilma", "officer_dibble"]);
        assert.assertEquals(
            "/my_home_boy/fred" + io.path_separator +
            "/my_home_boy/betty" + io.path_separator +
            "/my_home_boy/wilma" + io.path_separator +
            "/my_home_boy/officer_dibble",
            reply);
    },
    "can_print_a_few_arrays":function () {
        var reply = dependencies.graph_as_classpath('/my_home_boy',
            [
                {
                    "fred":[
                        {"betty":["bambam", "dino"]},
                        {"wilma":"pebbles"}
                    ]
                },
                {
                    "officer_dibble":"screw_you"
                }
            ]);
        assert.assertEquals(
            "/my_home_boy/fred/betty/bambam" + io.path_separator +
            "/my_home_boy/fred/betty/dino" + io.path_separator +
            "/my_home_boy/fred/wilma/pebbles" + io.path_separator +
            "/my_home_boy/officer_dibble/screw_you",
            reply);
    },
    "can_print_1_simple_graph_and_a_few_arrays":function () {
        var reply = dependencies.graph_as_classpath('/my_home_boy', {"fred":[
            {"betty":["bambam", "dino"]},
            {"wilma":"pebbles"}
        ]});
        assert.assertEquals(
            "/my_home_boy/fred/betty/bambam" + io.path_separator +
            "/my_home_boy/fred/betty/dino" + io.path_separator +
            "/my_home_boy/fred/wilma/pebbles",
            reply);
    }
})