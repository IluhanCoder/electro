import { CustomError } from "../customError";

export default class UserError extends CustomError {
  public statusCode: number;
  public type: string;

  constructor(type: string, message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  static WrongRole() {
    return new UserError("data", `Користувачеві відмовлено в доступі`, 400);
  }
}