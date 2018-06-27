import { Server, Room } from 'colyseus';
import * as index_1 from 'colyseus';
import { __awaiter } from '../utils/awaiter';

Object.assign(Room.prototype, {
    getRoomContext () {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                roomId: this.roomId,
                roomContext: this.roomContext,
            }
        });
    }
});

var onJoinRoomRequest = function (client, roomToJoin, clientOptions) {
    return __awaiter(this, void 0, void 0, function* () {

        const hasHandler = this.hasHandler(roomToJoin);
        let roomId;
        let isReconnect;

        if (!hasHandler && !index_1.isValidId(roomToJoin)) {
            throw new Error('join_request_fail');
        }

        if (clientOptions.sessionId) {
            isReconnect = yield this.presence.get(clientOptions.sessionId);
            if (isReconnect) {
                roomId = isReconnect;
            }
        }

        if (!roomId && clientOptions.roomContext) {
            var rooms = (yield this.getAvailableRooms(roomToJoin, 'getRoomContext'));
            var length = rooms.length;
            var roomContext = clientOptions.roomContext;
            var room, foundRoom;
            for (var i = 0; i < length; i ++) {
                room = rooms[i];
                if (room.roomContext == roomContext) {
                    foundRoom = room;
                    break;
                }
            }
            if (foundRoom) {
                roomId = foundRoom.roomId;
            } else {
                roomId = this.create(roomToJoin, clientOptions);

                if (roomId) {
                    // reserve seat for client on selected room
                    this.remoteRoomCall(roomId, '_reserveSeat', [{
                            id: client.id,
                            sessionId: clientOptions.sessionId,
                        }]);
                }
            }
        }

        if (!roomId) {
            throw new Error('join_request_fail');
        }

        return roomId;
    });
};

/**
 * 
 * @param gameserver : Server
 * Usage:
 *      import contextRoomPlugin from './plugin';
 *      
 *      const gameServer = new Server({
 *          engine: WebSocket.Server,
 *          server: createServer(app)
 *      });
 *      contextRoomPlugin(gameServer);
 */

export default function (gameserver: Server) {
    gameserver.matchMaker.onJoinRoomRequest = onJoinRoomRequest;
}