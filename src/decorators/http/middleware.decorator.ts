import { Middleware } from '@/types';
import 'reflect-metadata';
import { MIDDLEWARE_SYMBOL } from '../symbols';

export function UseMiddleware(...middlewares: Middleware[]) {
	return function (
		target: any,
		propertyKey?: string,
		descriptor?: PropertyDescriptor
	) {
		if (propertyKey && descriptor) {
			Reflect.defineMetadata(
				MIDDLEWARE_SYMBOL,
				middlewares,
				descriptor.value,
				propertyKey
			);
		} else {
			Reflect.defineMetadata(MIDDLEWARE_SYMBOL, middlewares, target);
		}
	};
}
