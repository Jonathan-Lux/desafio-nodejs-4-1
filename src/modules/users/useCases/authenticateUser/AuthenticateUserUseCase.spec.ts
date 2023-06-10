import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";



let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase : CreateUserUseCase

describe("create a new user authenticate",()=>{
    beforeEach(async()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })

    
    it("should be able to authenticate an user",async()=>{
        const user:ICreateUserDTO={
            name:"user test",
            email:"test@test.com",
            password:"123"
        }
        await createUserUseCase.execute(user)

        const auth = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        })

        expect(auth).toHaveProperty("token")
    })

    it("should not be able to authenticate if is'not user", async()=>{
        expect(async()=>{
            await authenticateUserUseCase.execute({
                email:"falsetest@test.com",
                password:"123"
            })
        }).rejects.toBeInstanceOf(AppError)
    })

    it("should not be able to authenticate if password is incorrect",async()=>{
        expect(async()=>{
            const user:ICreateUserDTO={
                name:"user test",
                email:"test@test.com",
                password:"123"
            }  
            await createUserUseCase.execute(user)

            await createUserUseCase.execute({
                name:"test",
                email:user.email,
                password:"567"
            })

        }).rejects.toBeInstanceOf(AppError)
    })

})