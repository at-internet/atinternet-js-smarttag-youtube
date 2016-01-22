module.exports = function (grunt) {
    var compilerPath = 'closure_compiler';
    // Project configuration
    grunt.initConfig({
        /*
         * JSHint configuration
         */
        jshint: {
            options: {
                jshintrc: true
            },
            all: ['Gruntfile.js', 'src/**.js']
        },
        /*
         * Run tests on files change
         */
        watch: {
            tests: {
                files: ['src/**.js', 'tests/**.js', 'Gruntfile.js'],
                tasks: ['karma:dev'],
                options: {
                    spawn: false
                }
            }
        },
        /*
         * Tests configuration
         */
        karma: {
            dev: {
                configFile: 'karma.conf.js',
                browsers: ['Firefox'],
                singleRun: false
            },
            coverage: {
                configFile: 'karma-coverage.conf.js',
                browsers: ['Firefox'],
                singleRun: true
            }
        },
        preprocess: {
            all: {
                src: 'src/at-smarttag-youtube.js',
                dest: 'working_place/at-smarttag-youtube.processed.js',
                options: {
                    inline: true,
                    context: {
                        test: false,
                        debug: false
                    }
                }
            }
        },
        'closure-compiler': {
            simple: {
                closurePath: compilerPath,
                js: ['working_place/at-smarttag-youtube.processed.js'],
                jsOutputFile: 'compiled/at-smarttag-youtube.min.js',
                maxBuffer: 500,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                }
            }
        },
        /*
         * Delete work directories
         */
        clean: {
            all: ['compiled', 'reports', 'working_place']
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Tasks
    grunt.registerTask('cleanAll', ['clean:all']);
    grunt.registerTask('dev', ['karma:dev', 'watch:tests']);
    grunt.registerTask('coverage', ['karma:coverage']);
    grunt.registerTask('deploy', ['clean:all', 'jshint:all', 'karma:coverage', 'preprocess:all', 'closure-compiler:simple']);
};