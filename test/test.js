
var http = require("http");
    var server = http.createServer(function(request,
    response) {
    response.write("Hello HTTP!");
    response.end();
});
server.listen(8000);