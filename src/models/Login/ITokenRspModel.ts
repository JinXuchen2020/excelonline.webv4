import { IUserRspModel } from "models";

export interface ITokenRspModel {
  id: string,
  code: number,
  message: string,
  token: string,
  user: IUserRspModel,
  timestamp: number
}