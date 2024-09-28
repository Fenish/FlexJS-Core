export function ResponseStatus(status: number) {
	return function (target: any, context: ClassMemberDecoratorContext) {
		Reflect.defineMetadata('status', status, target, context.name);
	};
}
