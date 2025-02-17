// Create web server
// Import modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var querystring = require('querystring');
var comments = [];

// Create server
http.createServer(function (req, res) {
  // Get request method
  var method = req.method;
  // Parse URL
  var urlObj = url.parse(req.url, true);
  var pathname = urlObj.pathname;
  // Get query string
  var query = urlObj.query;
  if (method === 'GET') {
    // If request method is GET
    if (pathname === '/') {
      // If request URL is '/'
      fs.readFile(path.join(__dirname, 'views', 'index.html'), 'utf8', function (err, data) {
        if (err) {
          return res.end('404 Not Found.');
        }
        // Read comments from file
        fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', function (err, commentsStr) {
          if (err) {
            return res.end('404 Not Found.');
          }
          comments = JSON.parse(commentsStr);
          var lis = comments.map(function (comment) {
            return `<li>${comment}</li>`;
          });
          var content = data.replace('{{lis}}', lis.join(''));
          res.end(content);
        });
      });
    } else if (pathname === '/comment') {
      // If request URL is '/comment'
      // Get comment
      var comment = query.comment;
      // Add comment to comments
      comments.push(comment);
      // Write comments to file
      fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), function (err) {
        if (err) {
          return res.end('404 Not Found.');
        }
        // Redirect to '/'
        res.writeHead(301, {
          Location: '/'
        });
        res.end();
      });
    } else {
      res.end('404 Not Found.');
    }
  } else {
    res.end('404 Not Found.');
  }
}).listen(3000, function () {
  console.log('Server is running at http://localhost:3000');
});