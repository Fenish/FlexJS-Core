import { STATUS_METADATA_KEY } from '../../metadata-keys';

export function ResponseStatus(status: number) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		Reflect.defineMetadata(
			STATUS_METADATA_KEY,
			status,
			descriptor.value,
			propertyKey
		);
	};
}
