import 'reflect-metadata';
import * as http from 'http';

import { PyroRequest, PyroResponse, Middleware } from '@/types';
import { IRoute } from '@/interfaces/IRoute';
import { IServerConfig } from '@/interfaces/IServerConfig';
import { Logger } from './logger';
import chalk from 'chalk';

export class PyroServer {
	private routes: IRoute[] = [];
	private server: http.Server;
	private controllers: any[] = [];
	private globalMiddlewares: Middleware[] = [];

	// CONFIG
	config?: IServerConfig;

	constructor(config?: IServerConfig) {
		this.config = config;

		Logger.initialize(this);
		Logger.info('Server initializing...');

		this.server = http.createServer(this.handleRequest.bind(this));
	}

	use(...middlewares: Middleware[]): this {
		this.globalMiddlewares.push(...middlewares);
		return this;
	}

	register(...controllers: any[]): this {
		Logger.info('Registering controllers...');

		this.controllers.push(...controllers);
		return this;
	}

	private registerControllers() {
		for (const controller of this.controllers) {
			this.registerController(controller);
			Logger.info(`Registered controller: ${controller.name}`);
		}
		Logger.debug(`Registered routes: ${JSON.stringify(this.routes)}`);
	}

	private registerController(controller: new () => any) {
		const controllerData =
			Reflect.getMetadata('controller_data', controller) || '';

		const controllerName = controllerData.path;
		const routes: any = controllerData.routes;
		Logger.debug(`Controller: ${controllerName}`);
		Logger.debug(`Routes: ${JSON.stringify(routes)}`);

		for (const route of routes) {
			const fullPath = `${controllerName}${route.path}`;
			this.routes.push({
				...route,
				path: fullPath,
			});
		}
	}

	private async handleRequest(req: PyroRequest, res: PyroResponse) {
		const url = new URL(req.url || '/', `http://${req.headers.host}`);
		const route = this.routes.find(
			(r) => r.method === req.method && r.path === url.pathname
		);

		if (!route) {
			res.writeHead(404, { 'Content-Type': 'application/json' });
			return res.end(JSON.stringify({ error: 'Route not found' }));
		}

		try {
			const middlewares = [
				...this.globalMiddlewares,
				...route.middlewares,
			];
			let index = 0;

			const runMiddleware = async () => {
				if (index < middlewares.length) {
					await middlewares[index](req, res, async () => {
						index++;
						await runMiddleware();
					});
				} else {
					const data = await route.handler(req, res);
					res.writeHead(route.status, {
						'Content-Type': 'application/json',
					});
					res.end(JSON.stringify(data));
				}
			};
			await runMiddleware();
		} catch (error) {
			res.writeHead(500, { 'Content-Type': 'application/json' });
			res.end(
				JSON.stringify({
					message: 'Internal Server Error',
					error: error,
				})
			);
		}
	}

	listen(port: number): http.Server {
		this.registerControllers();
		return this.server.listen(port, () => {
			getStartupMessage(port, this.routes);
		});
	}
}

function infoMsg(msg: string) {
	const prefix = chalk.green('*');
	console.log(`${prefix} ${msg}`);
}

function getStartupMessage(port: number, routes: any) {
	console.log(chalk.hex('#FFA500')('🔥 PyroJS'));
	infoMsg(`Server running on port: ${chalk.green(port)}`);
	infoMsg('Registered routes: ' + chalk.green(routes.length));
	infoMsg(`Press ${chalk.red('CTRL+C')} to stop server`);
}
