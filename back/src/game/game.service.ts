import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { identity } from 'rxjs';
import { Room } from './interfaces/room.interface';
import { Player } from './interfaces/player.interface';
import { Socket, Server } from 'socket.io';
import { GameData } from './interfaces/gameData.interface'
import { runInThisContext } from 'vm';

const refreshRate = 10;
const paddleSpeed = 1;
const ballSpeed = 0.5;


@Injectable()
export class GameService {

    constructor(private schedulerRegistry: SchedulerRegistry) {}

    rooms: Room[] = [];
    
    initBall(roomId: number)  {
        this.rooms[roomId].xball = 50;
        this.rooms[roomId].yball = 50;
        this.rooms[roomId].xSpeed = 0.15 + Math.random() * ballSpeed;
        this.rooms[roomId].ySpeed = 0.15 + Math.random() * ballSpeed;
        let dir = Math.round(Math.random());
        if (dir)
            this.rooms[roomId].xSpeed *= -1;
        dir = Math.round(Math.random());
        if (dir)
            this.rooms[roomId].ySpeed *= -1;
        };

    updateBall(roomId: number) {

        this.rooms[roomId].xball += this.rooms[roomId].xSpeed;
        this.rooms[roomId].yball += this.rooms[roomId].ySpeed;
    
        if (this.rooms[roomId].yball >= 98 || this.rooms[roomId].yball <= 2)
            this.rooms[roomId].ySpeed *= -1;
        if (this.rooms[roomId].xball >= (97 - (2 / 1.77)))
        {
            if (this.rooms[roomId].yball >= this.rooms[roomId].paddleRight && this.rooms[roomId].yball <= this.rooms[roomId].paddleRight + 10)
            {
                this.rooms[roomId].xball = (97 - (2 / 1.77));
                this.rooms[roomId].xSpeed *= -1;
            }
        }
        if (this.rooms[roomId].xball <= (3 + (2 / 1.77)))
        {
            if (this.rooms[roomId].yball >= this.rooms[roomId].paddleLeft && this.rooms[roomId].yball <= this.rooms[roomId].paddleLeft + 10)
            {
                this.rooms[roomId].xball = (3 + (2 / 1.77));
                this.rooms[roomId].xSpeed *= -1;
            }
        }
        if (this.rooms[roomId].xball >= (100 + (2 / 1.77)))
        {
            this.rooms[roomId].player1Score += 1;
            this.initBall(roomId);
        }
        if (this.rooms[roomId].xball <= (0 - (2 / 1.77)))
        {
            this.rooms[roomId].player2Score += 1;
            this.initBall(roomId);
        }
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
            player1Score: 0,
            player2Score: 0,
        }
        this.initBall(rid);
        var t = this;
        const interval = setInterval(function() { t.gameLoop(rid, server, game_data); }, refreshRate);
        this.schedulerRegistry.addInterval(String(rid), interval);
    }

    gameLoop(rid: number, server: Server, game_data: GameData) {

        this.updateBall(rid);
        this.updatePaddles(rid);
        game_data.yBall = this.rooms[rid].yball;
        game_data.xBall = this.rooms[rid].xball;
        game_data.paddleLeft = this.rooms[rid].paddleLeft;
        game_data.paddleRight = this.rooms[rid].paddleRight;
        game_data.player1Score = this.rooms[rid].player1Score;
        game_data.player2Score = this.rooms[rid].player2Score;
        server.to(this.rooms[rid].name).emit("update", game_data);
        return;
    }
}