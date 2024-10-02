export function createParameterContext(
	METADATA_KEY: symbol,
	data: any,
	target: any,
	propertyKey: any
) {
	const existingValues: {
		index: number;
		key?: string;
		callback: any;
	}[] = Reflect.getMetadata(METADATA_KEY, target, propertyKey) || [];
	existingValues.push(data);
	Reflect.defineMetadata(METADATA_KEY, existingValues, target, propertyKey);
}
