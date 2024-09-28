import { Middleware } from '@/types';
import 'reflect-metadata';
import { MIDDLEWARE_KEY } from '../symbols';

export function UseMiddleware(...middlewares: Middleware[]) {
	return function (
		target: any,
		propertyKey?: string,
		descriptor?: PropertyDescriptor
	) {
		if (propertyKey && descriptor) {
			Reflect.defineMetadata(
				MIDDLEWARE_KEY,
				middlewares,
				descriptor.value,
				propertyKey
			);
		} else {
			Reflect.defineMetadata(MIDDLEWARE_KEY, middlewares, target);
		}

		// // Check if it is a ClassMemberDecoratorContext
		// if ('kind' in context && context.kind === 'method') {
		// 	const existingMiddlewares =
		// 		Reflect.getMetadata('middlewares', target, context.name) || [];
		// 	Reflect.defineMetadata(
		// 		'middlewares',
		// 		[...existingMiddlewares, ...middlewares],
		// 		target,
		// 		context.name
		// 	);
		// } else if ('kind' in context && context.kind === 'class') {
		// 	const existingMiddlewares =
		// 		Reflect.getMetadata('middlewares', target) || [];
		// 	Reflect.defineMetadata(
		// 		'middlewares',
		// 		[...existingMiddlewares, ...middlewares],
		// 		target
		// 	);
		// }
	};
}
