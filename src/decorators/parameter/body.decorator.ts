export function Body() {
	return function (target: any, propertyKey: string, context: any) {
		console.log(target, propertyKey, context);
		Reflect.defineMetadata('body', true, target, context.name);
	};
}
