import { STATUS_SYMBOL } from '../symbols';

export function ResponseStatus(status: number) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		Reflect.defineMetadata(
			STATUS_SYMBOL,
			status,
			descriptor.value,
			propertyKey
		);
	};
}
