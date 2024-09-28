import { Controller, Get, UseMiddleware } from '../../src/decorators';
import { TestMiddleware } from '../middlewares/test';

@Controller('/auth')
export class AuthenticationController {
	@Get('/login')
	login() {
		return {
			message: 'login',
		};
	}

	@Get('/register')
	// @ResponseStatus(201)
	@UseMiddleware(TestMiddleware)
	register(body: any) {
		return { message: 'test' };
	}
}
