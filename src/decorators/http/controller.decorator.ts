import 'reflect-metadata';
import {
	CONTROLLER_NAME_KEY,
	MIDDLEWARE_KEY,
	ROUTE_HANDLER,
	ROUTES_KEY,
} from '../symbols';

export function Controller(path: string) {
	return function (target: any) {
		path = path.startsWith('/') ? path : '/' + path;
		const controllerData: any = {
			[CONTROLLER_NAME_KEY]: path,
			[ROUTES_KEY]: [],
			[MIDDLEWARE_KEY]: [],
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

			route_data[ROUTE_HANDLER] = target.prototype[method];
			controllerData[ROUTES_KEY].push(route_data);
		}

		const classMetaDataKeys = Reflect.getOwnMetadataKeys(target);
		for (const key of classMetaDataKeys) {
			const metaData = Reflect.getMetadata(key, target);
			controllerData[key] = metaData;
		}

		Reflect.defineMetadata('controller_data', controllerData, target);
	};
}
