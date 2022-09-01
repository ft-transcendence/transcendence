import { Dispatch } from "react";

export interface AuthContextType {
  user: string | null;
  signin: (user: string | null, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

export interface IUserInputsRef {
  username: React.RefObject<HTMLInputElement>;
  email: React.RefObject<HTMLInputElement>;
  password: React.RefObject<HTMLInputElement>;
}

export interface IUserInfo {
  username: string | null;
  email: string | null;
  password: string | null;
  clear: any;
}

export interface ItableRow {
  key: number;
  userModel: { username: string; avatar: string; id: number; status: number };
}

export interface IUserStatus {
  key: number;
  userModel: { id: number; status: number };
}

export interface userModel {
  id: number;
  username: string;
  avatar: string;
  friends: Array<userModel>;
  gamesLost: number;
  gamesPlayed: number;
  gamesWon: number;
  playTime: number;
  rank: number;
  score: number;
  winRate: number;
}

export interface gameModel {
  userId: number;
  opponentId: number;
  opponentUsername: string;
  opponentRank: number;
  duration: number;
  userScore: number;
  opponentScore: number;
  victory: boolean;
}
export class Users {
  key: number = 0;
  game: gameModel = {
    userId: 0,
    opponentId: 0,
    opponentUsername: "",
    opponentRank: 0,
    duration: 0,
    userScore: 0,
    opponentScore: 0,
    victory: false,
  };
}

export interface INotifCxt {
  setNotifShow: Dispatch<React.SetStateAction<boolean>>;
  setNotifText: Dispatch<React.SetStateAction<string>>;
}