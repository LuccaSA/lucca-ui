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
            less: {
                files: ['src/**/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            },
			sass: {
				files: ['src2/**/*.scss', 'src2/*.sass'],
				tasks: ['sass']
			}
        },
        less: {
            development: {
                options: {
                    compress: true,
                    relativeUrls:true,
                    sourceMap:true,
                    sourceMapFileInline:true,
                    sourceMapRootpath:"..",
                    optimization: 2
                },
                files: [
                    {
                        "dist/lucca-ui.min.css": "src/lucca-ui.dist.less",
                        "demo/demo.min.css": "demo/less/demo.less"
                    }
                ]
            }
        },
		sass: {
			development: {
				options: {
					sourcemap: 'inline',
					style: 'compressed', // compressed, compact, nested, expanded
					loadPath: [
						'src2',
						luiConfig.bowerPath,
						luiConfig.theme.path + '/' + luiConfig.theme.name,
						'themes/lucca'
					]
				},
				files: [
					{
						"dist/lucca-ui.namespaced.min.css": "src2/lucca-ui.namespaced.scss",
						"dist/lucca-ui.global.min.css": "src2/lucca-ui.global.scss",
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
	grunt.loadNpmTasks('grunt-contrib-less'); // loads less compiler
	grunt.loadNpmTasks('grunt-contrib-sass'); // loads less compiler
    grunt.loadNpmTasks('grunt-contrib-watch'); // loads watch contrib
    grunt.loadNpmTasks('grunt-concurrent'); // loads concurrent runner
    grunt.loadNpmTasks('grunt-contrib-concat'); // loads the file concatener
    grunt.loadNpmTasks('grunt-contrib-uglify'); // loads the file minifier
    grunt.registerTask('minifyjs', ['concat','uglify']);
    grunt.registerTask('default', ['concurrent']);

};
