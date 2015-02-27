"use strict";

module.exports = function (grunt) {
    // let grunt load npm tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // grunt initilization
    grunt.initConfig({
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'routes/**/*.js', 'models',
                    'test/createUserAndProfileTest.js.js', '*.js', '.jscsrc', '.jshintrc'],
                tasks: ['default'],
                options: {
                    spawn: true
                }
            }
        },
        jshint: {
            dev: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['Gruntfile.js', 'routes/**/*.js', 'models/**/*.js', 'test/createUserAndProfileTest.js.js', '*.js']
            }
        },
        jscs: {
            all: {
                options: {
                    config: ".jscsrc"
                },
                files: {
                    src: []
                }
            }
        },
        simplemocha: {
            all: {
                src: ['test/createUserAndProfileTest.js']
            }
        }
    });

    // register the tasks
    grunt.registerTask('test', ['jshint', 'jscs', 'simplemocha']);
    grunt.registerTask('default', ['test']);
};
