import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Room } from './interfaces/room.interface';
import { Server } from 'socket.io';
import { GameData } from './interfaces/gameData.interface'
import { findIndex } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { Mutex } from 'async-mutex';


const refreshRate = 10;
const paddleSpeed = 1;
const ballSpeed = 0.5;


@Injectable()
export class GameService {

    constructor(private schedulerRegistry: SchedulerRegistry, private userService: UserService) {}

    static rooms: Room[] = [];
    
    /**
    * init ball position and direction with some randomness at the beginning of each point
    */

    initBall(roomId: number)  {
        console.log(GameService.rooms.findIndex(room => room.id === roomId));
        GameService.rooms.find(room => room.id === roomId).xball = 50;
        GameService.rooms.find(room => room.id === roomId).yball = 50;
        GameService.rooms.find(room => room.id === roomId).xSpeed = ballSpeed;
        GameService.rooms.find(room => room.id === roomId).ySpeed = 0.15 + Math.random() * ballSpeed;
        let dir = Math.round(Math.random());
        if (dir)
            GameService.rooms.find(room => room.id === roomId).xSpeed *= -1;
        dir = Math.round(Math.random());
        if (dir)
            GameService.rooms.find(room => room.id === roomId).ySpeed *= -1;
        };

    /**
    * update ball coordinate
    */

    updateBall(roomId: number) {

        GameService.rooms.find(room => room.id === roomId).xball += GameService.rooms.find(room => room.id === roomId).xSpeed;
        GameService.rooms.find(room => room.id === roomId).yball += GameService.rooms.find(room => room.id === roomId).ySpeed;

        // game windows is 16/9 format - so 1.77, ball radius is 1vh

        // ball collision with floor or ceilling
        if (GameService.rooms.find(room => room.id === roomId).yball >= 98 || GameService.rooms.find(room => room.id === roomId).yball <= 2)
            GameService.rooms.find(room => room.id === roomId).ySpeed *= -1;

        // ball collision with right paddle (paddle position is 3% from the border, paddle height is 10% of the game windows)
        if (GameService.rooms.find(room => room.id === roomId).xball >= (97 - (2 / 1.77)))
        {
            if (GameService.rooms.find(room => room.id === roomId).yball >= GameService.rooms.find(room => room.id === roomId).paddleRight - 1 && GameService.rooms.find(room => room.id === roomId).yball <= GameService.rooms.find(room => room.id === roomId).paddleRight + 11) // ball radius is 1vh
            {
                GameService.rooms.find(room => room.id === roomId).xball = (97 - (2 / 1.77));
                GameService.rooms.find(room => room.id === roomId).xSpeed *= -1;
                GameService.rooms.find(room => room.id === roomId).ySpeed = ((GameService.rooms.find(room => room.id === roomId).yball - GameService.rooms.find(room => room.id === roomId).paddleRight) - 5) / 6 * ballSpeed; // make ball go up, straight or down based on  the part of the paddle touched
            }
        }
        // ball collision with left paddle
        if (GameService.rooms.find(room => room.id === roomId).xball <= (3 + (2 / 1.77)))
        {
            if (GameService.rooms.find(room => room.id === roomId).yball >= GameService.rooms.find(room => room.id === roomId).paddleLeft - 1 && GameService.rooms.find(room => room.id === roomId).yball <= GameService.rooms.find(room => room.id === roomId).paddleLeft + 11)
            {
                GameService.rooms.find(room => room.id === roomId).xball = (3 + (2 / 1.77));
                GameService.rooms.find(room => room.id === roomId).xSpeed *= -1;
                GameService.rooms.find(room => room.id === roomId).ySpeed = ((GameService.rooms.find(room => room.id === roomId).yball - GameService.rooms.find(room => room.id === roomId).paddleLeft) - 5) / 6 * ballSpeed;
            }
        }
        // end of point management
        if (GameService.rooms.find(room => room.id === roomId).xball >= (100 + (2 / 1.77)))
        {
            GameService.rooms.find(room => room.id === roomId).player1Score += 1;
            this.initBall(GameService.rooms.find(room => room.id === roomId).id);
        }
        if (GameService.rooms.find(room => room.id === roomId).xball <= (0 - (2 / 1.77)))
        {
            GameService.rooms.find(room => room.id === roomId).player2Score += 1;
            this.initBall(GameService.rooms.find(room => room.id === roomId).id);
        }
    }

    /**
    * set paddle direction (0 = none, 1 = up, 2 = down) based on data received from clients
    */

    updateRoom(player:number, roomId: number, dir: number)
    {
        if (player == 1)
            GameService.rooms.find(room => room.id === roomId).paddleLeftDir = dir;
        else
            GameService.rooms.find(room => room.id === roomId).paddleRightDir = dir;
    }

    /**
    * update paddle positions based on recorded paddle directions
    */

    updatePaddles(roomId: number)
    {
        if (GameService.rooms.find(room => room.id === roomId).paddleLeftDir == 1)
        {
            GameService.rooms.find(room => room.id === roomId).paddleLeft -= paddleSpeed;
            if (GameService.rooms.find(room => room.id === roomId).paddleLeft < 0)
                GameService.rooms.find(room => room.id === roomId).paddleLeft = 0
        }
        else if (GameService.rooms.find(room => room.id === roomId).paddleLeftDir == 2)
        {
            GameService.rooms.find(room => room.id === roomId).paddleLeft += paddleSpeed;
            if (GameService.rooms.find(room => room.id === roomId).paddleLeft > 90)
                GameService.rooms.find(room => room.id === roomId).paddleLeft = 90
        }
        if (GameService.rooms.find(room => room.id === roomId).paddleRightDir == 1)
        {
            GameService.rooms.find(room => room.id === roomId).paddleRight -= paddleSpeed;
            if (GameService.rooms.find(room => room.id === roomId).paddleRight < 0)
                GameService.rooms.find(room => room.id === roomId).paddleRight = 0
        }
        else if (GameService.rooms.find(room => room.id === roomId).paddleRightDir == 2)
        {
            GameService.rooms.find(room => room.id === roomId).paddleRight += paddleSpeed;
            if (GameService.rooms.find(room => room.id === roomId).paddleRight > 90)
                GameService.rooms.find(room => room.id === roomId).paddleRight = 90
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
            player1Name: GameService.rooms.find(room => room.id === rid).player1Name,
            player2Name: GameService.rooms.find(room => room.id === rid).player2Name,
            player1Avatar: GameService.rooms.find(room => room.id === rid).player1Avatar,
            player2Avater: GameService.rooms.find(room => room.id === rid).player2Avatar,
        }
        var mutex = new Mutex();
        this.initBall(rid);
        var t = this;
        const interval = setInterval(function() { t.gameLoop(rid, server, game_data, mutex); }, refreshRate); // create game loop
        this.schedulerRegistry.addInterval(String(rid), interval); // add game loop to the schedulerRegistry
    }

    /**
    * game loop: update ball, update paddles, prepare data for clients, send data to clients
    */

    async gameLoop(id: number, server: Server, game_data: GameData, mutex: Mutex) {  
        const release = await mutex.acquire();
        if (!GameService.rooms.find(room => room.id === id))
            return;
        this.updateBall(id);
        this.updatePaddles(id);

        game_data.yBall = GameService.rooms.find(room => room.id === id).yball;
        game_data.xBall = GameService.rooms.find(room => room.id === id).xball;
        game_data.paddleLeft = GameService.rooms.find(room => room.id === id).paddleLeft;
        game_data.paddleRight = GameService.rooms.find(room => room.id === id).paddleRight;
        game_data.player1Score = GameService.rooms.find(room => room.id === id).player1Score;
        game_data.player2Score = GameService.rooms.find(room => room.id === id).player2Score;

        server.to(GameService.rooms.find(room => room.id === id).name).emit("update", game_data);

        if (GameService.rooms.find(room => room.id === id).player1Score == 11 || GameService.rooms.find(room => room.id === id).player2Score == 11)
        {   
            this.schedulerRegistry.deleteInterval(String(id));
            const winner = GameService.rooms.find(room => room.id === id).player1Score > GameService.rooms.find(room => room.id === id).player2Score ? 1 : 2;
            server.to(GameService.rooms.find(room => room.id === id).name).emit("end_game", winner);
            if (winner == 1)
            {   
                this.userService.hasWon(GameService.rooms.find(room => room.id === id).player1.data.id);
                this.userService.hasLost(GameService.rooms.find(room => room.id === id).player2.data.id);
            }
            else
            {
                this.userService.hasWon(GameService.rooms.find(room => room.id === id).player2.data.id);
                this.userService.hasLost(GameService.rooms.find(room => room.id === id).player1.data.id);
            }
            // delete the room
            //server.sockets.in(GameService.rooms.find(room => room.id === id).name).socketsLeave(GameService.rooms.find(room => room.id === id).name);
            GameService.rooms.splice(GameService.rooms.findIndex(room => room.id === id));
        }
        release();
        return;
    }

    generate_new_id(): number {
        let id = Math.floor((Math.random() * 1000000) + 1);
        if((GameService.rooms.find(room => room.id === id)) === undefined)
            return (id);
        return (this.generate_new_id());
    }

    getGameList(): GameData[] {
        let list: GameData[] = [];
        GameService.rooms.forEach(room => {
            if (room.player2)
            {
                let data: GameData =  {
                    player1Name: room.player1Name,
                    player2Name: room.player2Name,
                    player1Avatar: room.player1Avatar,
                    player2Avater: room.player2Avatar,
                    player1Score: room.player1Score,
                    player2Score: room.player2Score,
                    gameID: room.id,
                };
                list.push(data);
            }
        })
        return list;
    }
}