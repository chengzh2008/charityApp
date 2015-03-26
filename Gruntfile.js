"use strict";

module.exports = function (grunt) {
    // let grunt load npm tasks
    // for back-end
    // let grunt load npm tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // for front-end
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');

    // grunt initilization
    grunt.initConfig({
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'routes/**/*.js', 'models', 'test/**/*.js', '*.js', '.jscsrc', '.jshintrc'],
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
                src: ['Gruntfile.js', 'routes/**/*.js', 'models/**/*.js', 'test/**/*.js', '*.js']
            }
        },
        jscs: {
            all: {
                options: {
                    config: ".jscsrc"
                },
                files: {
                    src: ['Gruntfile.js', 'routes/**/*.js', 'models/**/*.js', 'test/**/*.js', '*.js']
                }
            }
        },
        simplemocha: {
            all: {
                src: ['test/**/*.js']
            }
        },

        // for front-end
        clean: {
            build: {
                src: ['build/']
            }
        },
        copy: {
            build: {
                expand: true,
                cwd: 'app/',
                src: ['**/*.html', '**/*.css', 'directives', 'templates', 'img', 'css', 'fonts'],
                dest: 'build/',
                flatten: false,
                filter: 'isFile'
            }
        },
        browserify: {
            dev: {
                src: ['app/js/**/*.js'],
                dest: 'build/bundle.js'
            },
            test: {
                src: ['test/client_side/*_test.js'],
                dest: 'test/client_side/test_bundle.js'
            },
            karmatest: {
                src: ['test/karma_tests/*_test.js'],
                dest: 'test/karma_tests/karma_test_bundle.js'
            },
            options: {
                transform: ['debowerify']
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    // register the tasks
    grunt.registerTask('test', ['jshint', 'jscs', 'simplemocha']);
    grunt.registerTask('default', ['test']);

    // register the tasks for front-end
    grunt.registerTask('build', ['clean', 'browserify', 'copy']);
    grunt.registerTask('build:test', ['browserify:test']);
    grunt.registerTask('test:client', ['browserify:karmatest', 'karma:unit']);
};
