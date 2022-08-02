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
  userModel: { username: string; avatar: string; id: number };
}
