{
	name: 'ChangeMe',
	
	all: function() {
        return [ this.make, this.test, this.save ];
    },
	
	make: function(moduleName) {
		println('Compiling source');
		compile();
		io.copy(dir.sourceResources, dir.compileTo);
		println('Jarring compiled source');
        archive.jar({ clean: true, name: moduleName+'.jar' });
        println('Compiling tests');
        compile({ source: dir.test, classpath: dependencies.classpath([ 'repo:junit/4.11/','repo:hamcrest/core/1.3/', 'file:'+dir.interim+'/' ])});
        io.copy(dir.testResources, dir.compileTo);
        println('Jarring tests');
		archive.jar({ name: moduleName+'_tests.jar' });
	},
	
	test: function(moduleName) {
        println('Running tests')
		test.junit({ file: dir.interim+'/'+moduleName+'_tests.jar', classpath: dependencies.classpath(['file:'+dir.interim+'/']) });
	},
	
	save: function(moduleName) {
        io.clean(dir.goodToGo);
        archive.zip({ clean: true, destination: dir.goodToGo, name: moduleName+'.zip', roots: [ dir.interim, dir.config ] });
	}

}