/*
 * gruntmysql
 * http://sebastiankovacs.com/gruntplugin
 *
 * Copyright (c) 2014 Sebi Kovacs
 * Licensed under the MIT license.
 */

'use strict';

var mysql      = require('mysql');
var fs = require("fs");

module.exports = function(grunt) {
  grunt.registerMultiTask('insertDB', 'The best Grunt plugin ever.', function() {
      var self = this;
      var options = this.options();
      var connection = mysql.createConnection(options);

      this.files.forEach(function (file) {
        file.src.filter(function (filepath) {
          var done = self.async();

          if (!grunt.file.exists(filepath)) {
            done(false);
          } else {
            var filecontent = grunt.file.read(filepath);
            var sql = "INSERT INTO " + options.table + " (" + options.field + ") VALUES ('"+ filecontent +"')";

            connection.query(sql, function (err, result) {
              if(err) {
                done(false);
              }
              if (result.affectedRows == 1) {
                grunt.log.writeln('\nDatabase updated successfully. Rows affected: ' + result.affectedRows +'. ' + 'Insert ID: ' + result.insertId);
              }
              done();
            });
          }
        });
      });

      connection.end();
    });

};
