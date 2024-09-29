import { BODY_METADATA_KEY } from '@/metadata-keys';

export function Body(key?: string) {
	return function (
		target: any,
		propertyKey: string | symbol,
		parameterIndex: number
	) {
		const existingBodyParams: { index: number; key?: string }[] =
			Reflect.getMetadata(BODY_METADATA_KEY, target, propertyKey) || [];
		existingBodyParams.push({ index: parameterIndex, key });

		Reflect.defineMetadata(
			BODY_METADATA_KEY,
			existingBodyParams,
			target,
			propertyKey
		);
	};
}
