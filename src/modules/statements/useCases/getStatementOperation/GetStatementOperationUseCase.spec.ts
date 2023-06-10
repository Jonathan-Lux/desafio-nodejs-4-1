import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"


let getStatementOperationUseCase: GetStatementOperationUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

describe("get statement operation",()=>{
    beforeEach(async()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository,inMemoryStatementsRepository )
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
})
    it("should be able get statement operation",async()=>{
        const user = await createUserUseCase.execute({
            email: "user@example.com",
            name: "teste",
            password: "123"
        })
        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            amount: 1000,
            description:"deposit in account",
            type:OperationType.DEPOSIT
        })

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string,
        })

        expect(statementOperation).toHaveProperty("id")
        expect(statementOperation).toHaveProperty("user_id")
    })
    it("should not be able to get statement operation for a non-existant user", async () => {
        expect(async () => {
          const statementOperation = await getStatementOperationUseCase.execute({
            user_id: "user.id as string",
            statement_id: "statement.id as string",
          });
        }).rejects.toBeInstanceOf(AppError);
      });
    });
