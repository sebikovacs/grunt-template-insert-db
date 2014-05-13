/*
 * gruntmysql
 * http://sebastiankovacs.com/gruntplugin
 *
 * Copyright (c) 2014 Sebi Kovacs
 * Licensed under the MIT license.
 */

'use strict';

var mysql      = require('mysql');
var async      = require('async');
var fs         = require("fs");

module.exports = function(grunt) {
  grunt.registerMultiTask('insertTemplate', 'Insert templates into MySQL database', function() {
      
      var options = this.options();
      var connection = mysql.createConnection(options);
      var done = this.async();

      this.files.forEach(function (file) {
        var sql = "INSERT INTO " + options.table + " (" + options.field + ") VALUES ";
        
        for(var i = file.src.length - 1; i >= 0; i--) {
          var filecontent = grunt.file.read(file.src[i]);
          var values = "('"+ filecontent +"')";
          sql += values;
          if (i > 0) {
            sql += ',';
          }
        }

        connection.query(sql, function (err, result) {
          if(err) {
            done(false);
          }
          if (result && result.affectedRows === 1) {

            grunt.log.writeln('\nDatabase updated successfully.');
          }
          done();
        });
      });

      connection.end();
    });

};
