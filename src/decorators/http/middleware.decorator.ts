import { Middleware } from '../../types';
import 'reflect-metadata';
import { MIDDLEWARE_METADATA_KEY } from '../../metadata-keys';

export function UseMiddleware(...middlewares: Middleware[]) {
	return function (
		target: any,
		propertyKey?: string,
		descriptor?: PropertyDescriptor
	) {
		if (propertyKey && descriptor) {
			Reflect.defineMetadata(
				MIDDLEWARE_METADATA_KEY,
				middlewares,
				descriptor.value,
				propertyKey
			);
		} else {
			Reflect.defineMetadata(
				MIDDLEWARE_METADATA_KEY,
				middlewares,
				target
			);
		}
	};
}
