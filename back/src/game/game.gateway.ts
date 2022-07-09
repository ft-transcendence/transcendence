import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Room } from './interfaces/room.interface';
import { GameService } from './game.service';


@WebSocketGateway({cors: {
  origin: "http://localhost:3000"}})

export class GameGateway {
  constructor(private gameService: GameService) {}
  rooms: Room[] = [];

  @WebSocketServer()
  server: Server;


  @SubscribeMessage('game')
  handleMessage(client: any, payload: any): string {
    return "Gateway OK!";
  }
  
  @SubscribeMessage('start')
  handleStart(@ConnectedSocket() client: Socket) : number {
    if (this.rooms.length == 0 || this.rooms[this.rooms.length - 1].player2){
      var newRoom: Room = {
        id: this.rooms.length,
        name: this.rooms.length.toString(),
        player1: client,
      } 
      this.rooms.push(newRoom);
      client.join(this.rooms[this.rooms.length - 1].name);
    return -1;
  }
  else {
    this.rooms[this.rooms.length - 1].player2 = client;
    client.join(this.rooms[this.rooms.length - 1].name);
    this.rooms[this.rooms.length - 1].ballId = this.gameService.createBall(this.rooms[this.rooms.length - 1].name);
    console.log(this.rooms[this.rooms.length - 1].ballId);
    this.server.to(this.rooms[this.rooms.length - 1].name).emit("game_started", {});
    return this.rooms[this.rooms.length - 1].id;
  }
  }

@SubscribeMessage('getUpdate')
handleUpdate(@MessageBody('rid') rid: number) : any{
  console.log(rid);
  this.gameService.updateBall(this.rooms[rid].ballId);
  this.server.to(this.rooms[rid].name).emit("update", this.gameService.balls[rid]);
}
}