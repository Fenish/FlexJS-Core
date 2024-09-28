import 'reflect-metadata';
import {
	METHOD_KEY,
	MIDDLEWARE_KEY,
	ROUTE_PATH_KEY,
	STATUS_KEY,
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
					MIDDLEWARE_KEY,
					descriptor.value,
					propertyKey
				) || [];

			const existingStatusCode =
				Reflect.getMetadata(
					STATUS_KEY,
					descriptor.value,
					propertyKey
				) || 200;

			Reflect.defineMetadata(
				METHOD_KEY,
				method,
				descriptor.value,
				propertyKey
			);
			Reflect.defineMetadata(
				ROUTE_PATH_KEY,
				path,
				descriptor.value,
				propertyKey
			);
			Reflect.defineMetadata(
				MIDDLEWARE_KEY,
				[...existingMiddlewares],
				descriptor.value,
				propertyKey
			);
			Reflect.defineMetadata(
				STATUS_KEY,
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
