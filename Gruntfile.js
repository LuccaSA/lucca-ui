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
            js: {
                files: ['js/**/*.js'],
                tasks: ['minifyjs'],
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
                    'js/filters/timeFilters.js',
                    'js/filters/genericFilters.js',
                    'js/directives/user-select.js',
                    'js/directives/moment-picker.js',
                    'js/directives/timespan-picker.js',
                    'js/services/notifyService.js',
                ],
                // the location of the resulting JS file
                dest: 'dist/lucca-ui.js'
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
                        "demo/demo.min.css": "demo/less/demo.less",
                        "demo/timmi/timmi-styles.min.css": "demo/timmi/timmi-styles.less"
                    }
                ]
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: ['watch']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less'); // loads less compiler
    grunt.loadNpmTasks('grunt-contrib-watch'); // loads watch contrib
    grunt.loadNpmTasks('grunt-concurrent'); // loads concurrent runner
    grunt.loadNpmTasks('grunt-contrib-concat'); // loads the file concatener
    grunt.loadNpmTasks('grunt-contrib-uglify'); // loads the file minifier
    grunt.registerTask('minifyjs', ['concat','uglify']);
    grunt.registerTask('default', ['concurrent']);

};
