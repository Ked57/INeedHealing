var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/save"] = requestHandlers.save;
handle["/init"] = requestHandlers.init;

server.start(router.route, handle);