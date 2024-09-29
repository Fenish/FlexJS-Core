import 'reflect-metadata';
import {
	CONTROLLER_NAME_METADATA_KEY,
	MIDDLEWARE_METADATA_KEY,
	ROUTE_HANDLER_METADATA_KEY,
	ROUTES_METADATA_KEY,
} from '../symbols';

export function Controller(path: string) {
	return function (target: any) {
		path = path.startsWith('/') ? path : '/' + path;
		const controllerData: any = {
			[CONTROLLER_NAME_METADATA_KEY]: path,
			[ROUTES_METADATA_KEY]: [],
			[MIDDLEWARE_METADATA_KEY]: [],
		};

		const methods = Object.getOwnPropertyNames(target.prototype).filter(
			(name) => name !== 'constructor'
		);

		for (const method of methods) {
			const metaDataKeys = Reflect.getOwnMetadataKeys(
				target.prototype[method],
				method
			);

			const route_data: any = {};
			for (const key of metaDataKeys) {
				const metaData = Reflect.getMetadata(
					key,
					target.prototype[method],
					method
				);
				route_data[key] = metaData;
			}

			route_data[ROUTE_HANDLER_METADATA_KEY] = target.prototype[method];
			controllerData[ROUTES_METADATA_KEY].push(route_data);
		}

		const classMetaDataKeys = Reflect.getOwnMetadataKeys(target);
		for (const key of classMetaDataKeys) {
			const metaData = Reflect.getMetadata(key, target);
			controllerData[key] = metaData;
		}

		Reflect.defineMetadata('controller_data', controllerData, target);
	};
}
