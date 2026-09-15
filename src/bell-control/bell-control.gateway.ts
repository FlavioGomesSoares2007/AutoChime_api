import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class BellControlGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const schoolId = client.handshake.query.schoolId as string;

    if (schoolId) {
      const roomName = `school_${schoolId}`;
      client.join(roomName);
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {}


}
