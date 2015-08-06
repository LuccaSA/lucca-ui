module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            less: {
                files: ['**/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
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
                        "less2/lucca-ui.min.css": "less2/lucca-ui.dist.less",
                        "demo/timmi/timmi-styles.min.css": "demo/timmi/timmi-styles.less"
                    }
                ]
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: ['watch:less']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less'); // loads less compiler
    grunt.loadNpmTasks('grunt-contrib-watch'); // loads watch contrib
    grunt.loadNpmTasks('grunt-concurrent'); // loads concurrent runner
    grunt.registerTask('default', ['concurrent']);
};
