import 'reflect-metadata';
import { Middleware } from '@/types';

export function UseMiddleware(...middlewares: Middleware[]) {
	return function (target: any, context: ClassMemberDecoratorContext) {
		const existingMiddlewares =
			Reflect.getMetadata('middlewares', target, context.name) || [];
		Reflect.defineMetadata(
			'middlewares',
			[...existingMiddlewares, ...middlewares],
			target,
			context.name
		);
	};
}
