import { CustomError } from "../customError";

export default class ObjectError extends CustomError {
  public statusCode: number;
  public type: string;

  constructor(type: string, message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  static ObjectExists() {
    return new ObjectError("name", "обʼєкт з такою назвою вже додано", 400);
  }
}