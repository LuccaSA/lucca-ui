module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['js/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            dev: {
            },
            continuous: {
                singleRun: true,
                autoWatch: false,
                browsers: ['PhantomJS'],
                reporters: ['progress']
            },
            coverage: {
                singleRun: true,
                autoWatch: false,
                browsers: ['PhantomJS'],
                reporters: ['coverage'],
                preprocessors: {
                    'test/**/*.js': ['coverage'],
                }
            },
            ng12:{
                configFile: 'karma.ng12.js',
                singleRun: true,
                autoWatch: false,
                browsers: ['PhantomJS'],
                reporters: ['progress']
            }
        },
        watch: {
            less: {
                files: ['src/**/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            },
            js: {
                files: ['js/**/*.js'],
                tasks: ['minifyjs','jshint'], // minify is put before jshint because if jshint finds an error, it will not launch any tasks after that so the minification was not done
                options: {
                    nospawn: true
                }
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // we dont use the **/*.js synthax cuz it's still a WIP in the transition and all the js files are not meant to be distributed
                src: [
                    'js/lui.js',
                    'js/directives/*.js',
                    'js/directives/lucca/*.js',
                    'js/filters/*.js',
                ],
                // the location of the resulting JS file
                dest: 'dist/lucca-ui.js'
            },
            ng12:{
                src:[
                    'js/lui.js',
                    'js/directives/percentage-picker.js',
                    'js/directives/timespan-picker.js',
                    'js/filters/*.js',
                ],
                dest: 'dist/custom/lucca-ui-compat-ng-1-2.js'
            }
        },
        uglify: {
            options: {
            // the banner is inserted at the top of the output
                banner: '/*! lucca-ui <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/lucca-ui.min.js': ['<%= concat.dist.dest %>']
                }
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
    grunt.loadNpmTasks('grunt-contrib-watch'); // loads watch contrib
    grunt.loadNpmTasks('grunt-concurrent'); // loads concurrent runner
    grunt.loadNpmTasks('grunt-contrib-concat'); // loads the file concatener
    grunt.loadNpmTasks('grunt-contrib-uglify'); // loads the file minifier
    grunt.registerTask('minifyjs', ['concat:dist','uglify']);
    grunt.registerTask('default', ['concurrent']);
    grunt.registerTask('ng12', ['concat:ng12','karma:ng12']);

};
