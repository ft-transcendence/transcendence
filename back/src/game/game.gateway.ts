import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Room } from './interfaces/room.interface';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';
import { JwtService } from "@nestjs/jwt";
import { UserService } from 'src/user/user.service'; 
import { Client } from './interfaces/client.interface';


@WebSocketGateway({cors: {
  origin: "http://localhost:3000"}})

export class GameGateway {
  constructor(private gameService: GameService, private readonly jwtService: JwtService, private userService: UserService) {}
  

  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage('start')
  async handleStart(@ConnectedSocket() client: Client, context: any) : Promise<Player> {

    const user = await this.userService.getUser(client.data.id);
    console.log(user);

    // data to be provided to the client
    var player: Player = {
      playerNb: 0,
      roomId: 0,
    }

    if (this.gameService.rooms.length == 0 || this.gameService.rooms[this.gameService.rooms.length - 1].player2){ // no player in the queue
      let newId = this.gameService.generate_new_id();
      var newRoom: Room = {
        id: newId,
        name: newId.toString(),
        player1: client,
        paddleLeft: 45,
        paddleRight: 45,
        paddleLeftDir: 0,
        paddleRightDir: 0,
        player1Score: 0,
        player2Score: 0,
      } 
      this.gameService.rooms.push(newRoom);
      client.join(this.gameService.rooms[this.gameService.rooms.length - 1].name); // create a new websocket room
      player.playerNb = 1;
    }

  else { // one player is already waiting for an opponent

    this.gameService.rooms[this.gameService.rooms.length - 1].player2 = client;
    client.join(this.gameService.rooms[this.gameService.rooms.length - 1].name);
    this.server.to(this.gameService.rooms[this.gameService.rooms.length - 1].name).emit("game_started", {}); // inform clients that the game is starting
    this.gameService.startGame(this.gameService.rooms[this.gameService.rooms.length - 1].id, this.server);
    player.playerNb = 2;
  }

  player.roomId = this.gameService.rooms[this.gameService.rooms.length - 1].id;

  return player; // send data to client
  }

// receive paddle direction data from clients (0 = none, 1 = up, 2 = down)
@SubscribeMessage('move')
handlemove(@MessageBody('room') rid: number, @MessageBody('player') pid: number, @MessageBody('dir') dir: number) : any{
  this.gameService.updateRoom(pid, rid, dir);
}


}