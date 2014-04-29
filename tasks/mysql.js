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

  grunt.registerMultiTask('mysql', 'The best Grunt plugin ever.', function() {
      
      var options = this.options();
      var filepath = this.files[0].src[0];
      var filecontent = grunt.file.read(filepath);
      var sql = "INSERT INTO Design (design_html) VALUES ('something ')";

      var connection = mysql.createConnection({
        host: options.host,
        port: options.port,
        user: options.user,
        password: options.password,
        database: options.database
      });

      connection.query(sql, function (err, result) {
        console.log(err, result);
      });

      connection.end();
      
    });

};
