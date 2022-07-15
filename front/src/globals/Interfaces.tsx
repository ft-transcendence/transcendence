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
