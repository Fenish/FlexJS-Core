import * as http from 'http';
import 'reflect-metadata';

import {
	CONTROLLER_NAME_METADATA_KEY,
	METHOD_METADATA_KEY,
	MIDDLEWARE_METADATA_KEY,
	ROUTE_PATH_METADATA_KEY,
	ROUTES_METADATA_KEY,
} from '@/decorators/symbols';
import { LogLevel } from '@/enums/loglevel.enum';
import {
	findRoute,
	handleFaviconRequest,
	logRequest,
	processRoute,
	sendNotFoundResponse,
} from '@/handlers/request.handler';
import { IRoute } from '@/interfaces/route.interface';
import { IServerConfig } from '@/interfaces/server-config.interface';
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

		const controllerName = controllerData[CONTROLLER_NAME_METADATA_KEY];
		const routes: any = controllerData[ROUTES_METADATA_KEY];
		Logger.debug(`Controller: ${controllerName}`);

		const controllerMiddlewares =
			controllerData[MIDDLEWARE_METADATA_KEY] || [];
		for (const route of routes) {
			const fullPath = `${controllerName}${route[ROUTE_PATH_METADATA_KEY]}`;
			const middlewares = route[MIDDLEWARE_METADATA_KEY] || [];
			this.routes.push({
				...route,
				[ROUTE_PATH_METADATA_KEY]: fullPath,
				[MIDDLEWARE_METADATA_KEY]: [
					...middlewares,
					...controllerMiddlewares,
				],
			});
			Logger.debug(`Route: ${fullPath} (${route[METHOD_METADATA_KEY]})`);
		}
	}

	private async handleRequest(req: PyroRequest, res: PyroResponse) {
		const start = Date.now();

		if (handleFaviconRequest(req, res)) return;

		const route = findRoute(this.routes, req);

		if (!route) {
			sendNotFoundResponse(res);
		} else {
			await processRoute(req, res, route, this.globalMiddlewares);
		}

		logRequest(req, res, start);
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
