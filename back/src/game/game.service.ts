import { Injectable } from '@nestjs/common';
import { identity } from 'rxjs';
import { Ball } from './interfaces/ball.interface';

@Injectable()
export class GameService {
    balls: Ball[] = [];
    
    createBall(Roomid: string) :number {
        var ball: Ball = {
        id: this.balls.length,
        roomId: Roomid,
        status: true, // true = in progress
        x: 400,
        y: Math.random() * 600,
        xSpeed: Math.random(),
        ySpeed: Math.random(),
        };
        this.balls.push(ball);
        return ball.id;
    }

    updateBall(id: number) {
        this.balls[id].x += this.balls[id].xSpeed;
        this.balls[id].y += this.balls[id].ySpeed;
        if (this.balls[id].y >= 600 || this.balls[id].y <= 0)
            this.balls[id].ySpeed *= -1;
        if (this.balls[id].x >= 800 || this.balls[id].x <= 0)
            this.balls[id].xSpeed *= -1;
    }

}