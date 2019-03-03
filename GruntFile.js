module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: ['src/js/*.js'],
      tasks: ['concat']
    },
    concat: {
      dist: {
        src: 'src/js/*.js',
        dest: 'dist/js/main.js'
      }
    },
    uglify: {
      src: 'src/js/main.js',
      dest: 'main.min.js'
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      dist: {
        files: {
          'dist/js/main.js': 'src/js/main.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['watch']);

};