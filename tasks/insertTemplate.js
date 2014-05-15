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

      var templateFiles = this.files[1].src;
      var htmlFiles = this.files[0].src;
      var fields = 'design_label, design_description, design_html, design_notes, design_added_datetime, design_updated_datetime';

      var d = new Date();
      var yy = d.getFullYear();
      var mo = d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth();
      var dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();

      var hh = d.getHours();
      var mm = d.getMinutes();
      var ss = d.getSeconds();

      var design_added_datetime = yy + '-' + mo + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;

      var sql = "INSERT INTO " + options.table + " \
                  (" + fields + ") \
                 VALUES";
      
      for(var i = htmlFiles.length - 1; i >= 0; i--) {
        var context = yfm.extract(templateFiles[i]).context;

        var design_label = options.designLabel + ' / ' + context.label;
        var design_description = options.designDescription + ' / ' + context.description;
        var design_html = jsesc(grunt.file.read(htmlFiles[i]));
        var design_notes = options.designDescription + ' / ' + context.description;

        var values = "('"+ design_label +"', '"+ design_description +"', '"+ design_html +"', '"+ design_notes +"', '"+ design_added_datetime +"', '')";
        
        sql += values;
        if (i > 0) {
          sql += ',';
        }
      }

      connection.query(sql, function (err, result) {
        if(err) {
          console.log(err);
          done(false);
        }
        if (result && result.affectedRows === 1) {

          grunt.log.writeln('\nDatabase updated successfully.');
        }
        done();
      });
      
      connection.end();
    });

};
