import { HttpStatus } from '@/enums/http.enum';
import {
	Body,
	Controller,
	Get,
	Post,
	ResponseStatus,
	UseMiddleware,
} from '../../src/decorators';
import { GlobalMiddlewareTest } from '../middlewares/global.middleware';
import { TestMiddleware } from '../middlewares/test.middleware';

@Controller('/auth')
@UseMiddleware(GlobalMiddlewareTest)
export class AuthenticationController {
	@Post('/login')
	login(@Body('username') username: string, @Body() wholeBody: any) {
		return {
			username: username,
			...wholeBody,
		};
	}

	@Get('/register')
	@ResponseStatus(HttpStatus.CREATED)
	@UseMiddleware(TestMiddleware)
	register() {
		return { message: 'test' };
	}
}
