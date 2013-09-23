tests(
    {
        "can extend": function() {
            var to_extend = { "one":"two" };
            var extended_with = { "two":"three" };
            extend(to_extend, extended_with);
            assert.assertEquals("two", to_extend.one);
            assert.assertEquals("three", to_extend.two);
        },
        "can extend with override": function() {
            var to_extend = { "one":"two" };
            var extended_with = { "two":"three" };
            extend(to_extend, extended_with);
            assert.assertEquals("two", to_extend.one);
            assert.assertEquals("three", to_extend.two);
        },
        "cannot override with extend": function() {
            var to_extend = { "one":"two" };
            var extended_with = { "one":"three" };
            extend(to_extend, extended_with);
            assert.assertEquals("two", to_extend.one);
        },
        "can override with override": function() {
            var to_extend = { "one":"two" };
            var extended_with = { "one":"three" };
            override(to_extend, extended_with);
            assert.assertEquals("three", to_extend.one);
        },
        "can run file": function() {
            var scope = {};
            run("uk/co/itstherules/buildentertainment/to_run.js", scope);
            assert.assertEquals("fiiissshhhhhh", scope.fish);
        },
        "can require file": function() {
            var reply = require("uk/co/itstherules/buildentertainment/to_require.js");
            assert.assertTrue(reply.i_have.been.imported);
        },
        "can require linked file": function() {
            var reply = require("uk/co/itstherules/buildentertainment/require_chain.js");
            assert.assertTrue(reply.i_have.been.linked.i_have.been.imported);
        },
        "cannot require a non existent file": function() {
            try {
                require("ive_made_it_up.js");
            } catch(e) {
               assert.assertEquals('Unable to read file: ive_made_it_up.js', e);
            }
        }
    }
);