export function ResponseStatus(status: Number) {
    return function (target: any, context: ClassMemberDecoratorContext) {
        Reflect.defineMetadata('status', status, target, context.name);
    }
}