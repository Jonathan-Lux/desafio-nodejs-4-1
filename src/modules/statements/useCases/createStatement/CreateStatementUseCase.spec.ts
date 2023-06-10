import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import {OperationType} from "../../entities/Statement"
import { AppError } from "../../../../shared/errors/AppError";

let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("create Statement",()=>{
    beforeEach(()=>{
         inMemoryStatementsRepository= new InMemoryStatementsRepository()
         inMemoryUsersRepository= new InMemoryUsersRepository()
         createUserUseCase= new CreateUserUseCase(inMemoryUsersRepository)
         createStatementUseCase= new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
    })
    it("should be able to create a new statement", async ()=>{
        const user = await createUserUseCase.execute({
            name:"test",
            email:"test@example.com",
            password:"123"
        })
        if(user.id){
            const depositStatements = await createStatementUseCase.execute({
                user_id:user.id,
                amount:1000,
                description:"deposit in account",
                type: OperationType.DEPOSIT
            })

            const withdraw = await createStatementUseCase.execute({
                user_id:user.id,
                amount:1000,
                description:"withdraw account",
                type: OperationType.WITHDRAW
            })
            
            expect(withdraw).toHaveProperty("id")
            expect(withdraw).toHaveProperty("type","withdraw")

            expect(depositStatements).toHaveProperty("id")
            expect(depositStatements).toHaveProperty("type","deposit")
        }
    })
        it("should not be able to create statement if user is not exists", async()=>{
          expect(async()=>{
            await createStatementUseCase.execute({
                user_id:"non-existing-user-id",
                amount:1000,
                type:OperationType.WITHDRAW,
                description: "WITHDRAW"
            })
        
        }).rejects.toBeInstanceOf(AppError)
    })

        it("should not be able to withdraw money if balance is insufficient", async()=>{
            const user = await createUserUseCase.execute({
                name:"test",
                email:"test@example.com",
                password:"123"
            })
            expect(async()=>{
           await createStatementUseCase.execute({
                user_id:user.id as string,
                amount:1000,
                description:"withdraw account",
                type: OperationType.WITHDRAW
            })
        }).rejects.toBeInstanceOf(AppError)
        })
})
