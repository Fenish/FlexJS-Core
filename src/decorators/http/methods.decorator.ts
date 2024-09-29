import 'reflect-metadata';
import {
	METHOD_SYMBOL,
	MIDDLEWARE_SYMBOL,
	ROUTE_PATH_SYMBOL,
	STATUS_SYMBOL,
} from '../symbols';

function createMethodDecorator(method: string) {
	return function (path: string) {
		return function (
			target: any,
			propertyKey: string,
			descriptor: PropertyDescriptor
		) {
			path = path.startsWith('/') ? path : '/' + path;
			const existingMiddlewares =
				Reflect.getMetadata(
					MIDDLEWARE_SYMBOL,
					descriptor.value,
					propertyKey
				) || [];

			const existingStatusCode =
				Reflect.getMetadata(
					STATUS_SYMBOL,
					descriptor.value,
					propertyKey
				) || 200;

			Reflect.defineMetadata(
				METHOD_SYMBOL,
				method,
				descriptor.value,
				propertyKey
			);
			Reflect.defineMetadata(
				ROUTE_PATH_SYMBOL,
				path,
				descriptor.value,
				propertyKey
			);
			Reflect.defineMetadata(
				MIDDLEWARE_SYMBOL,
				[...existingMiddlewares],
				descriptor.value,
				propertyKey
			);
			Reflect.defineMetadata(
				STATUS_SYMBOL,
				existingStatusCode,
				descriptor.value,
				propertyKey
			);
		};
	};
}

export const Get = createMethodDecorator('GET');
export const Post = createMethodDecorator('POST');
export const Put = createMethodDecorator('PUT');
export const Patch = createMethodDecorator('PATCH');
export const Delete = createMethodDecorator('DELETE');
