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
                    { "dist/lucca-ui.min.css": "less/lucca-ui.less" }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less'); // charge la contrib less
    grunt.loadNpmTasks('grunt-contrib-watch'); // charge la contrib watch
    grunt.registerTask('default', ['less', 'watch']); // tache executees lors de la commande "$ grunt"
};