import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Room } from './interfaces/room.interface';
import { Server } from 'socket.io';
import { GameData } from './interfaces/gameData.interface'

const refreshRate = 10;
const paddleSpeed = 1;
const ballSpeed = 0.5;


@Injectable()
export class GameService {

    constructor(private schedulerRegistry: SchedulerRegistry) {}

    rooms: Room[] = [];
    
    /**
    * init ball position and direction with some randomness at the beginning of each point
    */

    initBall(roomId: number)  {
        this.rooms[roomId].xball = 50;
        this.rooms[roomId].yball = 50;
        this.rooms[roomId].xSpeed = ballSpeed;
        this.rooms[roomId].ySpeed = 0.15 + Math.random() * ballSpeed;
        let dir = Math.round(Math.random());
        if (dir)
            this.rooms[roomId].xSpeed *= -1;
        dir = Math.round(Math.random());
        if (dir)
            this.rooms[roomId].ySpeed *= -1;
        };

    /**
    * update ball coordinate
    */

    updateBall(roomId: number) {

        this.rooms[roomId].xball += this.rooms[roomId].xSpeed;
        this.rooms[roomId].yball += this.rooms[roomId].ySpeed;

        // game windows is 16/9 format - so 1.77, ball radius is 1vh

        // ball collision with floor or ceilling
        if (this.rooms[roomId].yball >= 98 || this.rooms[roomId].yball <= 2)
            this.rooms[roomId].ySpeed *= -1;

        // ball collision with right paddle (paddle position is 3% from the border, paddle height is 10% of the game windows)
        if (this.rooms[roomId].xball >= (97 - (2 / 1.77)))
        {
            if (this.rooms[roomId].yball >= this.rooms[roomId].paddleRight - 1 && this.rooms[roomId].yball <= this.rooms[roomId].paddleRight + 11) // ball radius is 1vh
            {
                this.rooms[roomId].xball = (97 - (2 / 1.77));
                this.rooms[roomId].xSpeed *= -1;
                this.rooms[roomId].ySpeed = ((this.rooms[roomId].yball - this.rooms[roomId].paddleRight) - 5) / 6 * ballSpeed; // make ball go up, straight or down based on  the part of the paddle touched
            }
        }
        // ball collision with left paddle
        if (this.rooms[roomId].xball <= (3 + (2 / 1.77)))
        {
            if (this.rooms[roomId].yball >= this.rooms[roomId].paddleLeft - 1 && this.rooms[roomId].yball <= this.rooms[roomId].paddleLeft + 11)
            {
                this.rooms[roomId].xball = (3 + (2 / 1.77));
                this.rooms[roomId].xSpeed *= -1;
                this.rooms[roomId].ySpeed = ((this.rooms[roomId].yball - this.rooms[roomId].paddleLeft) - 5) / 6 * ballSpeed;
            }
        }
        // end of point management
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

    /**
    * set paddle direction (0 = none, 1 = up, 2 = down) based on data received from clients
    */

    updateRoom(player:number, room: number, dir: number)
    {
        if (player == 1)
            this.rooms[room].paddleLeftDir = dir;
        else
            this.rooms[room].paddleRightDir = dir;
    }

    /**
    * update paddle positions based on recorded paddle directions
    */

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

    /**
    * game init
    */

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
        const interval = setInterval(function() { t.gameLoop(rid, server, game_data); }, refreshRate); // create game loop
        this.schedulerRegistry.addInterval(String(rid), interval); // add game loop to the schedulerRegistry
    }

    /**
    * game loop: update ball, update paddles, prepare data for clients, send data to clients
    */

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