var luiConfig = {
	bowerPath: 'bower_components',
	theme: {
		name: 'test',
		path: '/dev'
	}
};

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
			sass: {
				files: ['src2/**/*.scss', 'src2/*.sass'],
				tasks: ['sass']
			}
        },
		sass: {
			development: {
				options: {
					sourcemap: 'inline',
					style: 'expanded', // compressed, compact, nested, expanded
					loadPath: [
						luiConfig.theme.path + '/' + luiConfig.theme.name,
						'src',
						luiConfig.bowerPath,
					]
				},
				files: [
					{
						"dist/lucca-ui.namespaced.min.css": "src/lucca-ui.namespaced.scss",
						"dist/lucca-ui.global.min.css": "src/lucca-ui.global.scss",
						"demo/demo.min.css": "demo/sass/demo.scss"
					}
				]
			}
		},
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: ['watch','karma']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-sass'); // loads less compiler
    grunt.loadNpmTasks('grunt-contrib-watch'); // loads watch contrib
    grunt.loadNpmTasks('grunt-concurrent'); // loads concurrent runner
    grunt.loadNpmTasks('grunt-contrib-concat'); // loads the file concatener
    grunt.loadNpmTasks('grunt-contrib-uglify'); // loads the file minifier
    grunt.registerTask('minifyjs', ['concat','uglify']);
    grunt.registerTask('default', ['concurrent']);

};
