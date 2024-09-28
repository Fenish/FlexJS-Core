import 'reflect-metadata';

function createMethodDecorator(method: string) {
	return function (path: string) {
		return function (target: any, context: ClassMemberDecoratorContext) {
			path = path.startsWith('/') ? path : '/' + path;
			const existingMiddlewares =
				Reflect.getMetadata('middlewares', target, context.name) || [];
			const existingStatusCode =
				Reflect.getMetadata('status', target, context.name) || 200;

			Reflect.defineMetadata('method', method, target, context.name);
			Reflect.defineMetadata('path', path, target, context.name);
			Reflect.defineMetadata(
				'middlewares',
				[...existingMiddlewares],
				target,
				context.name
			);
			Reflect.defineMetadata(
				'status',
				existingStatusCode,
				target,
				context.name
			);
		};
	};
}

export const Get = createMethodDecorator('GET');
export const Post = createMethodDecorator('POST');
export const Put = createMethodDecorator('PUT');
export const Patch = createMethodDecorator('PATCH');
export const Delete = createMethodDecorator('DELETE');
