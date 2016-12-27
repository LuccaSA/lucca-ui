'use strict';

module.exports = function(grunt, options){
    return {
        options:{
            outputStyle: 'compressed',
            sourcemap: 'inline',
            includePaths: [
                'scss/themes/sample'
            ],
        },
        dist:{
            files: [
                {
                    "dist/lucca-ui.global.min.css": "scss/lucca-ui.global.scss"
                }
            ]
        },
        demo:{
            options: {
                includePaths: [
                    'scss/themes/sample'
                ],
                outputStyle: "expanded",
            },
            files: [
                {
                    "demo/demo.min.css": "demo/demo.scss"
                }
            ]
        },
        guidelines:{
            options: {
                includePaths: [
                    'scss/themes/sample'
                ],
                outputStyle: "expanded",
            },
            files: [
                {
                    "demo/guidelines.min.css": "demo/guidelines.scss"
                }
            ]
        }
    };
};