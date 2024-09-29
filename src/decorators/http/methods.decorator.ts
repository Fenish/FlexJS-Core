import { HttpMethods } from '@/enums/http.enum';
import 'reflect-metadata';
import {
	FUNCTION_PARAMETERS_METADATA_KEY,
	METHOD_METADATA_KEY,
	MIDDLEWARE_METADATA_KEY,
	ROUTE_PATH_METADATA_KEY,
	STATUS_METADATA_KEY,
} from '../../metadata-keys';

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

			const metaKeys = Reflect.getMetadataKeys(target, propertyKey);
			const parameters: any = [];
			for (const key of metaKeys) {
				const metaData = Reflect.getMetadata(key, target, propertyKey);
				metaData.sort((a: any, b: any) => a.index - b.index);
				for (const data of metaData) {
					parameters.push({
						type: key,
						data,
					});
				}
			}
			console.log(parameters);

			Reflect.defineMetadata(
				FUNCTION_PARAMETERS_METADATA_KEY,
				parameters,
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
