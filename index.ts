import * as path from 'path';
import * as express from 'express';
import * as serveIndex from 'serve-index';
import * as WebSocket from 'uws';
import { createServer } from 'http';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';

// Import demo room handlers
import { TestRoom } from './rooms/testRoom';
import { CreateOrJoinRoom } from './rooms/04-create-or-join-room';
import { LobbyRoom } from './rooms/lobby';
const port = Number(process.env.PORT || 2567);
const app = express();

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  engine: WebSocket.Server,
  server: createServer(app)
});

// Register ChatRoom with initial options, as "chat_with_options"
// onInit(options) will receive client join options + options registered here.
gameServer.register("testColyseus", TestRoom, {
    custom_options: "you can use me on Room#onInit"
});

gameServer.register("lobby", LobbyRoom).on("create", function(room) {
  console.log("On Lobby Created from index.js");
  room.gameServer = gameServer;
});
gameServer.register("create_or_join", CreateOrJoinRoom);

app.use('/', express.static(path.join(__dirname, "static")));
app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))

// (optional) attach web monitoring panel
app.use('/colyseus', monitor(gameServer));

gameServer.onShutdown(function(){
  console.log(`game server is going down.`);
});

gameServer.listen(port);
console.log(`Listening on http://localhost:${ port }`);
