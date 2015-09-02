// https://github.com/felixge/node-mysql/
// Teach IIFE vs. new
var Database = function() {

  this.init = function() {
    if(undefined === this.connection) {
      console.log("init database connection");
      var mysql      = require('mysql');
      this.connection = mysql.createConnection({
        host     : process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
        port     : process.env.OPENSHIFT_MYSQL_DB_PORT || '3306',
        user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
        password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'test1234',
        database : 'irclog'
      });
      this.connection.connect();
    }
  };

  function disconnect() {
    this.connection.end();
  }

  this.write = function(timestamp, message) {
    console.log("write to db", timestamp, message);
    this.connection.query('INSERT INTO log(timestamp, message) VALUES (?, ?)', [timestamp, message], 
    function(err, result) {
      if (err) throw err;
      console.log("something was written");
    });   
  };

  this.read = function(lines, callback) {
    if(!(lines>0 && lines < 1000)) {
      lines = 20;
    }
    this.connection.query("SELECT timestamp, message FROM log ORDER BY timestamp ASC", 
    function(err, result) {
      // Convert array to string - this could be done somewhere else too (e.g. UI)
      console.log("result:", result);

      var str = "<p>";
      for(var i=0; i<result.length; i++) {
        str += (new Date(result[i].timestamp) + ' : ' + result[i].message + '<br />');
      }
      str += '</p>';
      callback(err, str);
    });
  };
};

module.exports = Database;