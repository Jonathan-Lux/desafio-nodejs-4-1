
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUSeCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("show list users", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUSeCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able list users", async () => {
    const user = await createUserUseCase.execute({
      name: "user test",
      email: "test@test.com",
      password: "123",
    });
    if (user.id) {
      const users = await showUserProfileUSeCase.execute(user.id);

      expect(users.id).toBe(user.id);
    }
  });

});
