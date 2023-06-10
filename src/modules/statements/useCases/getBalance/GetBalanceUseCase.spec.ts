import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase

describe("get balance",()=>{
    beforeEach(async()=>{
        inMemoryUsersRepository= new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        getBalanceUseCase= new GetBalanceUseCase(inMemoryStatementsRepository , inMemoryUsersRepository)
    })

    it("should be able get user balance", async()=>{
        const user = await createUserUseCase.execute({
            email: "user@example.com",
            name: "user",
            password: "password"
        })

        const balance = await getBalanceUseCase.execute({
            user_id: user.id as string
        }) 

    

        expect(balance).toHaveProperty("balance")
        expect(balance).toHaveProperty("statement")
    })

    it("should not be able to get balance if user is not exists",async()=>{
        expect(async()=>{
            await getBalanceUseCase.execute({
                user_id:"not exists id"
            })

        }).rejects.toBeInstanceOf(AppError)
    })
})