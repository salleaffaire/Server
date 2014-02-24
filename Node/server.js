var sys = require("sys"),  
my_http = require("http"),  
path = require("path"),  
url = require("url"),  
fs = require("fs");

var start_web_socket = 0;

var static_file_server_port = 8900;
var video_data_server_port  = 8901;

var serving_from = "C:/travaux/cg/server/Demo"

// Creating the HTTP static file server
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------ 
my_http.createServer( function(request,response) {  
   var my_path = url.parse(request.url).pathname;  
   // var full_path = path.join(process.cwd(),my_path);  
   var full_path = path.join(serving_from,my_path);
   console.log(full_path);
   fs.exists(full_path, function(exists) {  
      if(!exists){  
          response.writeHeader(404, {"Content-Type": "text/plain"});
          response.write("404 Not Found\n");    
          response.end();  
      }  
      else {  
         fs.readFile(full_path, "binary", function(err, file) {    
            if(err) {    
               response.writeHeader(500, {"Content-Type": "text/plain"});    
               response.write(err + "\n");    
               response.end();         
            }    
            else {  
               response.writeHeader(200);    
               response.write(file, "binary");    
               response.end();  
            }        
         });
      }
   });  
}).listen(static_file_server_port);  
console.log("Static file server running on port: %d", static_file_server_port);
// ------------------------------------------------------------------------

// Web socket server - listening for video packets
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------ 

/*
if (start_web_socket) {
   var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: video_data_server_port});

   wss.on('connection', function(ws) {
      console.log("WS connected - listening to port: %d", video_data_server_port);
      ws.on('message', function(message) {
         console.log('received something - hope it looks like a JPEG');
      });
      // ws.send('something');
   });
}
*/