module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    compass: {
      dev: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'dist/',
          force: true,
          outputStyle: 'compressed',
          relativeAssets: true
        }
      }
    },

    jade: {
      compile: {
        files: {
          'dist/index.html':'src/jade/index.jade'
        }
      }
    },
    
    uglify: {
      dist: {
        files: {
          'dist/main.js': ['src/js/*.js']
        }
      }
    },

    watch: {
      compass: {
        files: ['src/sass/*.scss'],
        tasks: ['compass:dev']
      },
      jade: {
        files: ['src/jade/index.jade'],
        tasks: ['jade:compile']
      },
      uglify: {
        files: ['src/js/*.js'],
        tasks: ['uglify:dist']
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: ['dist/main.css', 'dist/index.html', 'dist/main.js']
        },
        options: {
          server: {
            baseDir: 'dist/'
          },
          watchTask: true,
          port: 8080
        }
      }
    },
    
    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    }

  });

  grunt.registerTask('dev', ['browserSync', 'watch']);
  grunt.registerTask('default', ['dev']);
  grunt.registerTask('gh-pages', ['gh-pages'])

};