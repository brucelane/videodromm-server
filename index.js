/*
  Original code from Colin Clark https://github.com/colinbdclark/osc.js-examples and https://github.com/florkestra/websocket-relay-server
*/
var osc = require("osc"),
    express = require("express"),
    WebSocket = require("ws"),
    config = require(__dirname + "/config.json");

var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

// Bind to a UDP socket to listen for incoming OSC events.
var udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1", // "192.168.0.34", "0.0.0.0",
    localPort: 9001
});

udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
    console.log("To start the demo, go to http://localhost:8081 in your web browser.");
});

udpPort.open();

// Create an Express-based Web Socket server to which OSC messages will be relayed.
var appResources = config.webRoot.indexOf("/") === 0 ? config.webRoot : __dirname + "/" + config.webRoot,
    app = express(),
    server = app.listen(config.port),
    wss = new WebSocket.Server({
        server: server
    });

app.use("/", express.static(appResources));
console.log("Server listening on port " + config.port);

var allConnectedSockets = [];

wss.on("connection", function (socket) {
    console.log("A Web Socket connection has been established!");
    allConnectedSockets.push(socket);

    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    var relay = new osc.Relay(udpPort, socketPort, {
        raw: true
    });

    socket.on("message", function (data) {
        allConnectedSockets.forEach(function (someSocket) {
            if (someSocket !== socket) {
                someSocket.send(data);
            }
        });
    });

    socket.on("close", function () {
        var idx = allConnectedSockets.indexOf(socket);
        allConnectedSockets.splice(idx, 1);
    });
});
