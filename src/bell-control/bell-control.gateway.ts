import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: [
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  },
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

  @SubscribeMessage('trigger_siren')
  handleManualTrigger(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { duration?: number },
  ) {
    const rooms = Array.from(client.rooms).filter((r) =>
      r.startsWith('school_'),
    );
    const schoolRoom = rooms[0];

    if (schoolRoom) {
      this.server.to(schoolRoom).emit('ring_siren', {
        duration: data?.duration || 5,
      });
    }
  }

  syncSchedulesToSchool(schoolId: string, schedules: any[]) {
    const roomName = `school_${schoolId}`;

    const payload = schedules.map((s) => ({
      day: s.dayOfWeek,
      time: typeof s.time === 'string' ? s.time.substring(0, 5) : s.time,
    }));

    this.server.to(roomName).emit('sync_schedules', payload);
  }
}
