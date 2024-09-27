import 'reflect-metadata';
import * as http from 'http';

import { PyroRequest, PyroResponse, RouteHandler, Middleware } from '@/types';
import { IRoute } from '@/interfaces/IRoute';

export class PyroServer {
    private routes: IRoute[] = [];
    private server: http.Server;
    private controllers: any[] = [];
    private globalMiddlewares: Middleware[] = [];

    constructor() {
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    use(...middlewares: Middleware[]): this {
        this.globalMiddlewares.push(...middlewares);
        return this;
    }

    register(...controllers: any[]): this {
        this.controllers.push(...controllers);
        return this;
    }

    private registerControllers() {
        for (const controller of this.controllers) {
            this.registerController(controller);
        }
    }

    private registerController(controller: new () => any) {
        const controllerData = Reflect.getMetadata('controller_data', controller) || '';

        const controllerName = controllerData.path;
        const routes:any = controllerData.routes;

        for (const route of routes) {
            const fullPath = `${controllerName}${route.path}`;
            this.routes.push({
                ...route,
                path: fullPath
            });
        }
    }

    private async handleRequest(req: PyroRequest, res: PyroResponse) {
        const url = new URL(req.url || '/', `http://${req.headers.host}`);
        const route = this.routes.find(r => r.method === req.method && r.path === url.pathname);

        if (!route) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Route not found' }));
        }

        try {
            const middlewares = [...this.globalMiddlewares, ...route.middlewares];
            let index = 0;

            const runMiddleware = async () => {
                if (index < middlewares.length) {
                    await middlewares[index](req, res, async () => {
                        index++;
                        await runMiddleware();
                    });
                } else {
                    const data = await route.handler(req, res);
                    res.writeHead(route.status, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data));
                }
            };
            await runMiddleware();
            
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }

    listen(port: number): http.Server {
        this.registerControllers();
        return this.server.listen(port, () => {
            console.log(`🔥 PyroJS server running on port ${port}`);
        });
    }
}