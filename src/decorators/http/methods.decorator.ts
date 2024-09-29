import { HttpMethods } from '@/enums/http.enum';
import 'reflect-metadata';
import {
	METHOD_METADATA_KEY,
	MIDDLEWARE_METADATA_KEY,
	ROUTE_PATH_METADATA_KEY,
	STATUS_METADATA_KEY,
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
					MIDDLEWARE_METADATA_KEY,
					descriptor.value,
					propertyKey
				) || [];

			const existingStatusCode =
				Reflect.getMetadata(
					STATUS_METADATA_KEY,
					descriptor.value,
					propertyKey
				) || 200;

			Reflect.defineMetadata(
				METHOD_METADATA_KEY,
				method,
				descriptor.value,
				propertyKey
			);
			Reflect.defineMetadata(
				ROUTE_PATH_METADATA_KEY,
				path,
				descriptor.value,
				propertyKey
			);
			Reflect.defineMetadata(
				MIDDLEWARE_METADATA_KEY,
				[...existingMiddlewares],
				descriptor.value,
				propertyKey
			);
			Reflect.defineMetadata(
				STATUS_METADATA_KEY,
				existingStatusCode,
				descriptor.value,
				propertyKey
			);
		};
	};
}

export const Get = createMethodDecorator(HttpMethods.GET);
export const Post = createMethodDecorator(HttpMethods.POST);
export const Put = createMethodDecorator(HttpMethods.PUT);
export const Patch = createMethodDecorator(HttpMethods.PATCH);
export const Delete = createMethodDecorator(HttpMethods.DELETE);
