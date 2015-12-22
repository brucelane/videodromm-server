# videodromm-server
Server responsible for message routing. 
Websockets server for OSC, MIDI, etc. made with nodejs
* Serve static web resources from the <code>web</code> directory using Express
* Listen for Web Socket connections on port 8081
* Relay incoming messages from a Web Socket client to all other connected clients

Original code from:
- https://github.com/colinbdclark/osc.js-examples
- https://github.com/florkestra/websocket-relay-server

## Installation

1. Run <code>npm install</code> in the terminal to install all required Node dependencies
2. In the <code>web</code> directory, run <code>bower install</code</code> to install all web dependencies

## Running the Example

1. Run <code>node .</code> in the Terminal
2. Open <code>http://localhost:8081</code> in your browser
3. For example, use Ableton Live with LiveOSC (sends on port 9001) on the same PC
4. Write your own custom code to connect to the relay server using a Web Socket connection at <code>ws://localhost:8081</code>
5. Send messages messages to the server using your Web Socket; they'll be relayed to all other connected clients

