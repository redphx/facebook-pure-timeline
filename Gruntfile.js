'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      options: { force: true },
      chrome: ['build/chrome']
    },
    watch: {
      options: { force: true },
      all: {
        files: ['main/**', 'chrome/**'],
        tasks: ['default', 'jshint:all'],
        options: {
          spawn: false,
        }
      },
      chrome: {
        files: ['main/**', 'chrome/**'],
        tasks: ['chrome', 'jshint:chrome'],
        options: {
          spawn: false,
        }
      }
    },
    copy: {
      chrome: {
        files: [
          { cwd: 'main/', src: '*', dest: 'build/chrome/', expand: true, filter: 'isFile' },
          { cwd: 'main/js/', src: '**', dest: 'build/chrome/js/', expand: true },
          { cwd: 'main/css/', src: '**', dest: 'build/chrome/css/', expand: true },
          { cwd: 'main/img/', src: '**', dest: 'build/chrome/img/', expand: true },

          { cwd: 'chrome/', src: '*', dest: 'build/chrome/', expand: true, filter: 'isFile' },
          { cwd: 'chrome/js/', src: '*', dest: 'build/chrome/js/', expand: true },
          { cwd: 'chrome/css/', src: '*', dest: 'build/chrome/css/', expand: true },
          { cwd: 'chrome/img/', src: '*', dest: 'build/chrome/img/', expand: true }
        ]
      }
    },
    replace: {
      chrome: {
        src: ['build/chrome/js/*.js', 'build/chrome/manifest.json'],
        overwrite: true,
        replacements: [{
          from: /\$EXTENSION_NAME/g,
          to: '<%= pkg.extension %>'
        }, {
          from: /\$EXTENSION_VERSION/g,
          to: '<%= pkg.version %>'
        }, {
          from: /\$EXTENSION_DESCRIPTION/g,
          to: '<%= pkg.description %>'
        }, {
          from: /\$EXTENSION_AUTHOR/g,
          to: '<%= pkg.author %>'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'build/chrome/**/**.js'
        ]
      },
      chrome: {
        src: [
          'build/chrome/**/**.js'
        ]
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'clean',
    'copy',
    'replace:chrome'
  ]);

  grunt.registerTask('chrome', [
    'clean:chrome',
    'copy:chrome',
    'replace:chrome'
  ]);
};