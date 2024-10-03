export function createParameterContext(
	METADATA_KEY: symbol,
	target: any,
	propertyKey: any,
	index: number,
	key: string | undefined,
	callback: any
) {
	const existingValues: {
		index: number;
		key?: string;
		callback: any;
	}[] = Reflect.getMetadata(METADATA_KEY, target, propertyKey) || [];

	const data = {
		index: index,
		key: key,
		callback: callback,
	};

	existingValues.push(data);
	Reflect.defineMetadata(METADATA_KEY, existingValues, target, propertyKey);
}
