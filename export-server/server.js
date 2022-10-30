/*
    Plotly.js offline image export server with Node.js
    Copyright (C) 2018, 2020, 2021, 2022  Dirk Stolle

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

const fs = require('fs');
const http = require('http');
const path = require('path');
const ssr = require('./ssr.js');
const url = require('url');
const { v4: uuidv4 } = require('uuid');

// Use hostname from environment variable HOST, if it is set.
const hostname = process.env.HOST || 'localhost';
// Use port from environment variable PORT, if it is set and valid.
const parsedPort = parseInt(process.env.PORT);
if (process.env.PORT) {
  if (isNaN(parsedPort)) {
   console.log('Warning: PORT environment variable is not a number, using port 3000!');
  } else if (parsedPort <= 0 || parsedPort > 65535) {
   console.log('Warning: PORT environment variable is not a number between 1 and 65535, using port 3000!');
  } else if (parsedPort < 1024) {
   // Unless user is root or admin, binding to well-known ports is usually denied by the OS.
   console.log('Warning: Binding to ports below 1024 may require root / administrative privileges!');
  }
}
const port = (parsedPort && parsedPort > 0 && parsedPort < 65536) ? parsedPort : 3000;

const server = http.createServer(function(req, res) {
  // ---- Handle SVG file requests ----
  const file = url.parse(req.url);
  if (file.pathname !== '/') {
    // It is a file request.
    let realPath = file.pathname.slice(1);
    // Avoid directory traversal.
    if ((realPath.indexOf('/') !== -1) || (realPath.indexOf('\\') !== -1)) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Forbidden');
    }
    // Avoid access to any non-SVG files.
    if (!realPath.endsWith('.svg')) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Only requests to SVG files are allowed.');
    }
    var s = fs.createReadStream(realPath);
    s.on('open', function () {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.statusCode = 200; // 200 == OK
        s.pipe(res);
    });
    s.on('end', function () {
        res.end();
    });
    s.on('error', function () {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
    return;
  }

  // ---- Handle plot generation requests ----

  // Only post request shall be allowed.
  if (req.method !== 'POST') {
    res.statusCode = 405; // 405 == Method not allowed
    res.setHeader('Content-Type', 'text/plain');
    res.end('Only POST requests are allowed!\n');
    return;
  }

  var body = '';
  var killed = false;
  // Gather data.
  req.on('data', function (data) {
    body += data;
    // Avoid flooding the server with large requests. Limit is 5 MB (mega as in
    // SI prefixes).
    if (body.length > 5000000) {
      res.statusCode = 413; // 413 == Payload Too Large
      res.setHeader('Content-Type', 'text/plain');
      res.end('Request size exceeds reasonable limits!\n');
      req.connecion.destroy();
      killed = true;
      return;
    }
  });

  // Event gets triggered when there is no more data from the client.
  req.on('end', async function () {
    if (killed) {
      return;
    }
    body = body.trim();
    try {
      // Try to parse into JSON to check validity.
      const jsObject = JSON.parse(body);
    } catch (e) {
      if (body.startsWith('[') && body.endsWith(']')) {
        // Remove brackets and try again.
        body = body.substr(0, body.length - 2);
        try {
          const js2 = JSON.parse(body);
        } catch (e) {
          res.statusCode = 400; // 400 == Bad Request
          res.setHeader('Content-Type', 'text/plain');
          res.end('Post data is not valid JSON!\n');
          killed = true;
          return;
        }
      } else {
        res.statusCode = 400; // 400 == Bad Request
        res.setHeader('Content-Type', 'text/plain');
        res.end('Post data is not valid JSON!\n');
        killed = true;
        return;
      }
    }
    if (killed) {
      return;
    }
    // Render file with JSDOM.
    const filename = 'graph-' + uuidv4() + '.svg';
    const result = await ssr.render(body, filename, 700, 400);
    if (result.success) {
      res.statusCode = 200; // 200 == OK
    } else {
      res.statusCode = 500; // 500 == Internal Server Error
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
});

// Send 400 Bad Request, if client errored out.
server.on('clientError', function(err, socket) {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(port, hostname, function() {
  console.log('=> Server running at http://' + hostname + ':' +port + '/');
});
