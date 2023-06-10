import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("create new user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able a new create user", async () => {
    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@example.com",
      password: "123",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able a new create user with email exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "test",
        email: "test@example.com",
        password: "123",
      });
      await createUserUseCase.execute({
        name: "test",
        email: "test@example.com",
        password: "123",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
