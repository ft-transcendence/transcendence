import { Socket } from "dgram";
import { Game } from "./game.interface";

export interface Ball 
{
    id: number;
    roomId: string;
    status: boolean; // true = in progress
    x: number;
    y: number;
    xSpeed: number;
    ySpeed: number;
}


