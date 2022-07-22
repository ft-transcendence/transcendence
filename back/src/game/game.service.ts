import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Room } from './interfaces/room.interface';
import { Server } from 'socket.io';
import { GameData } from './interfaces/gameData.interface'
import { findIndex } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';


const refreshRate = 10;
const paddleSpeed = 1;
const ballSpeed = 0.5;


@Injectable()
export class GameService {

    constructor(private schedulerRegistry: SchedulerRegistry, private userService: UserService) {}

    rooms: Room[] = [];
    
    /**
    * init ball position and direction with some randomness at the beginning of each point
    */

    initBall(roomId: number)  {
        console.log(this.rooms.findIndex(room => room.id === roomId));
        this.rooms.find(room => room.id === roomId).xball = 50;
        this.rooms.find(room => room.id === roomId).yball = 50;
        this.rooms.find(room => room.id === roomId).xSpeed = ballSpeed;
        this.rooms.find(room => room.id === roomId).ySpeed = 0.15 + Math.random() * ballSpeed;
        let dir = Math.round(Math.random());
        if (dir)
            this.rooms.find(room => room.id === roomId).xSpeed *= -1;
        dir = Math.round(Math.random());
        if (dir)
            this.rooms.find(room => room.id === roomId).ySpeed *= -1;
        };

    /**
    * update ball coordinate
    */

    updateBall(roomId: number) {

        this.rooms.find(room => room.id === roomId).xball += this.rooms.find(room => room.id === roomId).xSpeed;
        this.rooms.find(room => room.id === roomId).yball += this.rooms.find(room => room.id === roomId).ySpeed;

        // game windows is 16/9 format - so 1.77, ball radius is 1vh

        // ball collision with floor or ceilling
        if (this.rooms.find(room => room.id === roomId).yball >= 98 || this.rooms.find(room => room.id === roomId).yball <= 2)
            this.rooms.find(room => room.id === roomId).ySpeed *= -1;

        // ball collision with right paddle (paddle position is 3% from the border, paddle height is 10% of the game windows)
        if (this.rooms.find(room => room.id === roomId).xball >= (97 - (2 / 1.77)))
        {
            if (this.rooms.find(room => room.id === roomId).yball >= this.rooms.find(room => room.id === roomId).paddleRight - 1 && this.rooms.find(room => room.id === roomId).yball <= this.rooms.find(room => room.id === roomId).paddleRight + 11) // ball radius is 1vh
            {
                this.rooms.find(room => room.id === roomId).xball = (97 - (2 / 1.77));
                this.rooms.find(room => room.id === roomId).xSpeed *= -1;
                this.rooms.find(room => room.id === roomId).ySpeed = ((this.rooms.find(room => room.id === roomId).yball - this.rooms.find(room => room.id === roomId).paddleRight) - 5) / 6 * ballSpeed; // make ball go up, straight or down based on  the part of the paddle touched
            }
        }
        // ball collision with left paddle
        if (this.rooms.find(room => room.id === roomId).xball <= (3 + (2 / 1.77)))
        {
            if (this.rooms.find(room => room.id === roomId).yball >= this.rooms.find(room => room.id === roomId).paddleLeft - 1 && this.rooms.find(room => room.id === roomId).yball <= this.rooms.find(room => room.id === roomId).paddleLeft + 11)
            {
                this.rooms.find(room => room.id === roomId).xball = (3 + (2 / 1.77));
                this.rooms.find(room => room.id === roomId).xSpeed *= -1;
                this.rooms.find(room => room.id === roomId).ySpeed = ((this.rooms.find(room => room.id === roomId).yball - this.rooms.find(room => room.id === roomId).paddleLeft) - 5) / 6 * ballSpeed;
            }
        }
        // end of point management
        if (this.rooms.find(room => room.id === roomId).xball >= (100 + (2 / 1.77)))
        {
            this.rooms.find(room => room.id === roomId).player1Score += 1;
            this.initBall(this.rooms.find(room => room.id === roomId).id);
        }
        if (this.rooms.find(room => room.id === roomId).xball <= (0 - (2 / 1.77)))
        {
            this.rooms.find(room => room.id === roomId).player2Score += 1;
            this.initBall(this.rooms.find(room => room.id === roomId).id);
        }
    }

    /**
    * set paddle direction (0 = none, 1 = up, 2 = down) based on data received from clients
    */

    updateRoom(player:number, roomId: number, dir: number)
    {
        if (player == 1)
            this.rooms.find(room => room.id === roomId).paddleLeftDir = dir;
        else
            this.rooms.find(room => room.id === roomId).paddleRightDir = dir;
    }

    /**
    * update paddle positions based on recorded paddle directions
    */

    updatePaddles(roomId: number)
    {
        if (this.rooms.find(room => room.id === roomId).paddleLeftDir == 1)
        {
            this.rooms.find(room => room.id === roomId).paddleLeft -= paddleSpeed;
            if (this.rooms.find(room => room.id === roomId).paddleLeft < 0)
                this.rooms.find(room => room.id === roomId).paddleLeft = 0
        }
        else if (this.rooms.find(room => room.id === roomId).paddleLeftDir == 2)
        {
            this.rooms.find(room => room.id === roomId).paddleLeft += paddleSpeed;
            if (this.rooms.find(room => room.id === roomId).paddleLeft > 90)
                this.rooms.find(room => room.id === roomId).paddleLeft = 90
        }
        if (this.rooms.find(room => room.id === roomId).paddleRightDir == 1)
        {
            this.rooms.find(room => room.id === roomId).paddleRight -= paddleSpeed;
            if (this.rooms.find(room => room.id === roomId).paddleRight < 0)
                this.rooms.find(room => room.id === roomId).paddleRight = 0
        }
        else if (this.rooms.find(room => room.id === roomId).paddleRightDir == 2)
        {
            this.rooms.find(room => room.id === roomId).paddleRight += paddleSpeed;
            if (this.rooms.find(room => room.id === roomId).paddleRight > 90)
                this.rooms.find(room => room.id === roomId).paddleRight = 90
        }
    }

    /**
    * game init
    */

    async startGame(rid: number, server: Server) {
        var game_data: GameData = {
            paddleLeft: 45,
            paddleRight: 45,
            xBall: 50,
            yBall: 50,
            player1Score: 0,
            player2Score: 0,
            player1Name: await this.userService.getUser(this.rooms.find(room => room.id === rid).player1.data.id).then((value: User) => value.username),
            player2Name: await this.userService.getUser(this.rooms.find(room => room.id === rid).player2.data.id).then((value: User) => value.username),
            player1Avatar: await this.userService.getUser(this.rooms.find(room => room.id === rid).player1.data.id).then((value: User) => value.avatar),
            player2Avater: await this.userService.getUser(this.rooms.find(room => room.id === rid).player2.data.id).then((value: User) => value.avatar),
        }
        this.initBall(rid);
        var t = this;
        const interval = setInterval(function() { t.gameLoop(rid, server, game_data); }, refreshRate); // create game loop
        this.schedulerRegistry.addInterval(String(rid), interval); // add game loop to the schedulerRegistry
    }

    /**
    * game loop: update ball, update paddles, prepare data for clients, send data to clients
    */

    gameLoop(id: number, server: Server, game_data: GameData) {  
        this.updateBall(id);
        this.updatePaddles(id);

        game_data.yBall = this.rooms.find(room => room.id === id).yball;
        game_data.xBall = this.rooms.find(room => room.id === id).xball;
        game_data.paddleLeft = this.rooms.find(room => room.id === id).paddleLeft;
        game_data.paddleRight = this.rooms.find(room => room.id === id).paddleRight;
        game_data.player1Score = this.rooms.find(room => room.id === id).player1Score;
        game_data.player2Score = this.rooms.find(room => room.id === id).player2Score;

        server.to(this.rooms.find(room => room.id === id).name).emit("update", game_data);

        if (this.rooms.find(room => room.id === id).player1Score == 11 || this.rooms.find(room => room.id === id).player2Score == 11)
        {   
            const winner = this.rooms.find(room => room.id === id).player1Score > this.rooms.find(room => room.id === id).player2Score ? 1 : 2;
            this.schedulerRegistry.deleteInterval(String(id));
            server.to(this.rooms.find(room => room.id === id).name).emit("end_game", winner);
        }
        return;
    }

    generate_new_id(): number {
        let id = Math.floor((Math.random() * 1000000) + 1);
        console.log(id);
        if((this.rooms.find(room => room.id === id)) === undefined)
            return (id);
        return (this.generate_new_id());
    }
}