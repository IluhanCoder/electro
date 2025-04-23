import { CustomError } from "../customError";

export default class AuthError extends CustomError {
  public statusCode: number;
  public type: string;

  constructor(type: string, message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  static LoginPasswordNotMatches() {
    return new AuthError("password", "пароль та підтвердження пароля мають співпадати", 400);
  }

  static UserNotFound() {
    return new AuthError("user", "користувача не було знайдено", 400);
  }

  static InvalidPassword() {
    return new AuthError("password", "неправильний пароль", 400);
  }

  static DataExists(fieldName: string) {
    return new AuthError("data", `Поле "${fieldName}" з таким значенням вже існує.`, 400);
  }

  static VerificationFailed() {
    return new AuthError("data", `Помилка авторизації. Спробуйте зайти знову`, 401);
  }
}