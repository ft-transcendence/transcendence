import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({cors: {
  origin: "http://localhost:3000"}})
export class GameGateway {
  @SubscribeMessage('game')
  handleMessage(client: any, payload: any): string {
    return "Gateway OK!";
  }
}
