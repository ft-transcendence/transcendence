import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Room } from './interfaces/room.interface';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';
import { PlainObjectToNewEntityTransformer } from 'typeorm/query-builder/transformer/PlainObjectToNewEntityTransformer';


@WebSocketGateway({cors: {
  origin: "http://localhost:3000"}})

export class GameGateway {
  constructor(private gameService: GameService) {}
  

  @WebSocketServer()
  server: Server;


  @SubscribeMessage('game')
  handleMessage(client: any, payload: any): string {
    return "Gateway OK!";
  }
  
  @SubscribeMessage('start')
  handleStart(@ConnectedSocket() client: Socket) : Player {
    var player: Player = {
      playerNb: 0,
      roomId: 0,
    }
    if (this.gameService.rooms.length == 0 || this.gameService.rooms[this.gameService.rooms.length - 1].player2){
      var newRoom: Room = {
        id: this.gameService.rooms.length,
        name: this.gameService.rooms.length.toString(),
        player1: client,
        ballId: -1,
        paddleLeft: 45,
        paddleRight: 45,
        paddleLeftDir: 0,
        paddleRightDir: 0,
      } 
      this.gameService.rooms.push(newRoom);
      client.join(this.gameService.rooms[this.gameService.rooms.length - 1].name);
      player.playerNb = 1;
    }
  else {
    this.gameService.rooms[this.gameService.rooms.length - 1].player2 = client;
    client.join(this.gameService.rooms[this.gameService.rooms.length - 1].name);
    this.server.to(this.gameService.rooms[this.gameService.rooms.length - 1].name).emit("game_started", {});
    this.gameService.startGame(this.gameService.rooms.length - 1, this.server);
    player.playerNb = 2;
  }
  player.roomId = this.gameService.rooms[this.gameService.rooms.length - 1].id;
  return player;
  }

@SubscribeMessage('move')
handlemove(@MessageBody('room') rid: number, @MessageBody('player') pid: number, @MessageBody('dir') dir: number) : any{
  this.gameService.updateRoom(pid, rid, dir);
}


}