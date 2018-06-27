import * as express from 'express';
import * as serveIndex from 'serve-index';
import * as WebSocket from 'uws';
import { createServer } from 'http';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import contextRoomPlugin from './src/plugins/ContextRoom';

import { Game } from './src/Game';

const port = Number(process.env.PORT || 2567);
const app = express();

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
    engine: WebSocket.Server,
    server: createServer(app)
});
contextRoomPlugin(gameServer);

gameServer.register("game", Game);

// (optional) attach web monitoring panel
app.use('/colyseus', monitor(gameServer));

gameServer.onShutdown(function(){
    console.log(`game server is going down.`);
});

gameServer.listen(port);
console.log(`Listening on http://localhost:${ port }`);