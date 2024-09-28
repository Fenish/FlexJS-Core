export function Body() {
	return function (target: any, context: ClassMemberDecoratorContext) {
		console.log('31');
		Reflect.defineMetadata('body', true, target, context.name);
	};
}
