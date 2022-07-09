import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { identity } from 'rxjs';
import { Ball } from './interfaces/ball.interface';
import { Room } from './interfaces/room.interface';
import { Player } from './interfaces/player.interface';
import { Socket, Server } from 'socket.io';
import { GameData } from './interfaces/gameData.interface'

const refreshRate = 10;
const paddleSpeed = 1;


@Injectable()
export class GameService {

    constructor(private schedulerRegistry: SchedulerRegistry) {}

    rooms: Room[] = [];
    balls: Ball[] = [];

    
    createBall(Roomid: string) :number {
        var ball: Ball = {
        id: this.balls.length,
        roomId: Roomid,
        status: true, // true = in progress
        x: 50,
        y: Math.random() * 98,
        xSpeed: Math.random(),
        ySpeed: Math.random(),
        };
        this.balls.push(ball);
        return ball.id;
    }

    updateBall(id: number) {
        this.balls[id].x += this.balls[id].xSpeed;
        this.balls[id].y += this.balls[id].ySpeed;
        if (this.balls[id].y >= 98 || this.balls[id].y <= 2)
            this.balls[id].ySpeed *= -1;
        if (this.balls[id].x >= (100 - (2 / 1.77)) || this.balls[id].x <= (0 + (2 / 1.77)))
            this.balls[id].xSpeed *= -1;
    }

    updateRoom(player:number, room: number, dir: number)
    {
        if (player == 1)
            this.rooms[room].paddleLeftDir = dir;
        else
            this.rooms[room].paddleRightDir = dir;
    }

    updatePaddles(roomId: number)
    {
        if (this.rooms[roomId].paddleLeftDir == 1)
        {
            this.rooms[roomId].paddleLeft -= paddleSpeed;
            if (this.rooms[roomId].paddleLeft < 0)
                this.rooms[roomId].paddleLeft = 0
        }
        else if (this.rooms[roomId].paddleLeftDir == 2)
        {
            this.rooms[roomId].paddleLeft += paddleSpeed;
            if (this.rooms[roomId].paddleLeft > 90)
                this.rooms[roomId].paddleLeft = 90
        }
        if (this.rooms[roomId].paddleRightDir == 1)
        {
            this.rooms[roomId].paddleRight -= paddleSpeed;
            if (this.rooms[roomId].paddleRight < 0)
                this.rooms[roomId].paddleRight = 0
        }
        else if (this.rooms[roomId].paddleRightDir == 2)
        {
            this.rooms[roomId].paddleRight += paddleSpeed;
            if (this.rooms[roomId].paddleRight > 90)
                this.rooms[roomId].paddleRight = 90
        }
    }

    startGame(rid: number, server: Server) {
        var game_data: GameData = {
            paddleLeft: 45,
            paddleRight: 45,
            xBall: 50,
            yBall: 50,
        }
        var t = this;
        const interval = setInterval(function() { t.gameLoop(rid, server, game_data); }, refreshRate);
        this.schedulerRegistry.addInterval(String(rid), interval);
    }

    gameLoop(rid: number, server: Server, game_data: GameData) {
        if (this.rooms[rid].ballId == -1)
            this.rooms[rid].ballId = this.createBall(this.rooms[rid].name);
        this.updateBall(this.rooms[rid].ballId);
        this.updatePaddles(rid);
        game_data.yBall = this.balls[this.rooms[rid].ballId].y;
        game_data.xBall = this.balls[this.rooms[rid].ballId].x;
        game_data.paddleLeft = this.rooms[rid].paddleLeft;
        game_data.paddleRight = this.rooms[rid].paddleRight;
        server.to(this.rooms[rid].name).emit("update", game_data);
        return;
    }
}