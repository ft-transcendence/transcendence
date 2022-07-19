import React from "react";
import { IUserInputsRef } from "./Interfaces";

export const GUserInputsRefs: IUserInputsRef = {
  username: React.createRef(),
  email: React.createRef(),
  password: React.createRef(),
};
