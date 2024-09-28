import 'reflect-metadata';

export function Controller(path: string) {
    return function (constructor: new (...args: any[]) => any) {
        path = path.startsWith('/') ? path : '/' + path;
        const methodNames = Object.getOwnPropertyNames(constructor.prototype)
            .filter(name => name !== 'constructor'); // Exclude the constructor

        const routes = [];
        for (const methodName of methodNames) {
            const method = constructor.prototype[methodName];
            const metaDataKeys = Reflect.getOwnMetadataKeys(method, methodName);
            
            const metaValues:any = {}
            for (const key of metaDataKeys) {
                const metaData = Reflect.getMetadata(key, method, methodName);
                metaValues[key] = metaData;
            }

            routes.push({
                method: metaValues.method,
                path: path + metaValues.path,
                handler: method,
                ...metaValues
            })
        }

        const controller = {
            path,
            routes
        }
        Reflect.defineMetadata('controller_data', controller, constructor);
    }
}
