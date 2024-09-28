import * as http from 'http';
import 'reflect-metadata';
import * as zlib from 'zlib';

import {
	CONTROLLER_NAME_KEY,
	METHOD_KEY,
	MIDDLEWARE_KEY,
	ROUTE_HANDLER,
	ROUTE_PATH_KEY,
	ROUTES_KEY,
	STATUS_KEY,
} from '@/decorators/symbols';
import { LogLevel } from '@/enums/loglevel';
import { IRoute } from '@/interfaces/IRoute';
import { IServerConfig } from '@/interfaces/IServerConfig';
import { Middleware, PyroRequest, PyroResponse } from '@/types';
import chalk from 'chalk';
import { Logger } from '../utils/logger';

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
	}

	private registerController(controller: new () => any) {
		const controllerData =
			Reflect.getMetadata('controller_data', controller) || '';

		const controllerName = controllerData[CONTROLLER_NAME_KEY];
		const routes: any = controllerData[ROUTES_KEY];
		Logger.debug(`Controller: ${controllerName}`);

		const controllerMiddlewares = controllerData[MIDDLEWARE_KEY] || [];
		for (const route of routes) {
			const fullPath = `${controllerName}${route[ROUTE_PATH_KEY]}`;
			const middlewares = route[MIDDLEWARE_KEY] || [];
			this.routes.push({
				...route,
				[ROUTE_PATH_KEY]: fullPath,
				[MIDDLEWARE_KEY]: [...middlewares, ...controllerMiddlewares],
			});
			Logger.debug(`Route: ${fullPath} (${route[METHOD_KEY]})`);
		}
	}

	private async handleRequest(req: PyroRequest, res: PyroResponse) {
		const start = Date.now();
		if (req.url === '/favicon.ico') {
			res.writeHead(204); // No Content
			res.end();
			return;
		}

		const url = new URL(req.url || '/', `http://${req.headers.host}`);
		const route: any = this.routes.find(
			(r: any) =>
				r[METHOD_KEY] === req.method &&
				r[ROUTE_PATH_KEY] === url.pathname
		);

		if (!route) {
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ error: 'Route not found' }));
		}

		if (route) {
			Logger.debug(
				`Route found: ${route[ROUTE_PATH_KEY]} (${route[METHOD_KEY]})`
			);
			try {
				const middlewares = [
					...this.globalMiddlewares,
					...route[MIDDLEWARE_KEY],
				];
				let index = 0;

				const runMiddleware = async () => {
					if (index < middlewares.length) {
						Logger.debug(
							`Running middleware: ${middlewares[index].name}`
						);
						middlewares[index](req, res, async () => {
							index++;
							await runMiddleware();
						});
					} else {
						Logger.debug(
							`Running handler: ${route[ROUTE_HANDLER].name}`
						);
						const data = await route[ROUTE_HANDLER](req, res);

						const acceptEncoding =
							req.headers['accept-encoding'] || '';

						const responseData = JSON.stringify(data);
						const shouldCompress = responseData.length > 1024;

						if (acceptEncoding.includes('gzip') && shouldCompress) {
							Logger.debug('Compressed with GZIP');
							res.writeHead(route[STATUS_KEY], {
								'Content-Encoding': 'gzip',
								'Content-Type': 'application/json',
							});
							const compressedData = zlib.gzipSync(responseData);
							Logger.debug(
								`Compressed data: ${compressedData.length} bytes`
							);
							res.end(compressedData);
						} else {
							res.writeHead(route[STATUS_KEY], {
								'Content-Type': 'application/json',
							});
							Logger.debug(
								`Returned Data: ${responseData.length} bytes`
							);
							res.end(JSON.stringify(data));
						}
					}
				};
				await runMiddleware();
			} catch (error) {
				console.log(error);
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.end(
					JSON.stringify({
						message: 'Internal Server Error',
						error: error,
					})
				);
			}
		}

		const responseTime = Date.now() - start;
		Logger.http(req.method, res.statusCode, req.url, responseTime);
	}

	listen(port: number): http.Server {
		this.registerControllers();
		return this.server.listen(port, () => {
			getStartupMessage(port, this.routes, this.config?.logger?.level);
		});
	}
}

function infoMsg(msg: string) {
	const prefix = chalk.green('*');
	console.log(`${prefix} ${msg}`);
}

function getStartupMessage(
	port: number,
	routes: any,
	logLevel: LogLevel | undefined
) {
	console.log(chalk.hex('#FFA500')('🔥 PyroJS'));
	infoMsg(`Server running on port: ${chalk.green(port)}`);
	infoMsg('Registered routes: ' + chalk.green(routes.length));
	infoMsg('Logging level: ' + chalk.green(logLevel || 'info'));
	infoMsg(`Press ${chalk.red('CTRL+C')} to stop server\n`);
}
