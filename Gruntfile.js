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
                    // compress: true,
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
					// style: 'compressed',
					sourcemap: 'inline',
					loadPath: [
						'src2',
						luiConfig.bowerPath,
						luiConfig.theme.path + '/' + luiConfig.theme.name,
						'themes/lucca'
						// // Core directories
						// 'src2/core/definitions',
						// 'src2/core/elements',
						// 'src2/core/elements/inputs',
						// 'src2/core/utilities',
						// 'src2/core/variables',
						// 'src2/plugins/angular-ui-bootstrap-reskin',
						// 'src2/plugins/angular-ui-bootstrap-reskin/components',
						// 'src2/plugins/lucca-app-layout',
						// 'src2/plugins/lucca-app-layout/components',
						//
						// // Expected theming directories
						// 'themes/' + themeName + '/definitions',
						// 'themes/' + themeName + '/elements',
						// 'themes/' + themeName + '/utilities',
						// 'themes/' + themeName + '/variables',
						// 'themes/' + themeName + '/plugins/angular-ui-bootstrap-reskin',
						// 'themes/' + themeName + '/plugins/lucca-app-layout'
					]
				},
				files: [
					{
						"dist/lucca-ui.min.css": "src2/lucca-ui.dist.scss",
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
