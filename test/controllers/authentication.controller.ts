import { Controller, ResponseStatus } from '../../src/decorators';
import { Get } from '../../src/decorators';



@Controller('/auth')
export class AuthenticationController {
    
    @Get('/login')
    login() {
        return {
            message: 'login'
        };
    }

    @Get('/register')
    @ResponseStatus(201)
    register() {
        return {
            message: 'register'
        };
    }
}