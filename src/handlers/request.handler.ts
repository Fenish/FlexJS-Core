import {
	METHOD_SYMBOL,
	MIDDLEWARE_SYMBOL,
	ROUTE_HANDLER_SYMBOL,
	ROUTE_PATH_SYMBOL,
	STATUS_SYMBOL,
} from '@/decorators/symbols';
import { PyroRequest, PyroResponse } from '@/types';
import * as zlib from 'zlib';
import { Logger } from '../utils/logger';

// Function to handle favicon requests
export function handleFaviconRequest(
	req: PyroRequest,
	res: PyroResponse
): boolean {
	if (req.url === '/favicon.ico') {
		res.writeHead(204); // No Content
		res.end();
		return true;
	}
	return false;
}

// Function to parse URL and find the route
export function findRoute(routes: any[], req: PyroRequest): any {
	const url = new URL(req.url || '/', `http://${req.headers.host}`);
	return routes.find(
		(r: any) =>
			r[METHOD_SYMBOL] === req.method &&
			r[ROUTE_PATH_SYMBOL] === url.pathname
	);
}

// Function to send a 404 response
export function sendNotFoundResponse(res: PyroResponse): void {
	res.writeHead(404, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({ error: 'Route not found' }));
}

// Function to process middlewares and handler for a given route
export async function processRoute(
	req: PyroRequest,
	res: PyroResponse,
	route: any,
	globalMiddlewares: any[]
) {
	Logger.debug(
		`Route found: ${route[ROUTE_PATH_SYMBOL]} (${route[METHOD_SYMBOL]})`
	);

	try {
		const middlewares = [...globalMiddlewares, ...route[MIDDLEWARE_SYMBOL]];
		let index = 0;

		const runMiddleware = async () => {
			if (index < middlewares.length) {
				Logger.debug(`Running middleware: ${middlewares[index].name}`);
				await middlewares[index](req, res, async () => {
					index++;
					await runMiddleware();
				});
			} else {
				await handleRouteHandler(req, res, route);
			}
		};

		await runMiddleware();
	} catch (error) {
		console.log(error);
		res.writeHead(500, { 'Content-Type': 'application/json' });
		res.end(
			JSON.stringify({ message: 'Internal Server Error', error: error })
		);
	}
}

// Function to run the route handler and send a response
async function handleRouteHandler(
	req: PyroRequest,
	res: PyroResponse,
	route: any
) {
	Logger.debug(`Running handler: ${route[ROUTE_HANDLER_SYMBOL].name}`);
	const data = await route[ROUTE_HANDLER_SYMBOL]();

	const acceptEncoding = req.headers['accept-encoding'] || '';
	const responseData = JSON.stringify(data);
	const shouldCompress = responseData.length > 1024;

	if (acceptEncoding.includes('gzip') && shouldCompress) {
		sendCompressedResponse(res, route, responseData);
	} else {
		sendJsonResponse(res, route, responseData);
	}
}

function sendCompressedResponse(
	res: PyroResponse,
	route: any,
	responseData: string
) {
	Logger.debug('Compressed with GZIP');
	res.writeHead(route[STATUS_SYMBOL], {
		'Content-Encoding': 'gzip',
		'Content-Type': 'application/json',
	});

	const compressedData = zlib.gzipSync(responseData);
	Logger.debug(`Compressed data: ${compressedData.length} bytes`);
	res.end(compressedData);
}

function sendJsonResponse(res: PyroResponse, route: any, responseData: string) {
	res.writeHead(route[STATUS_SYMBOL], {
		'Content-Type': 'application/json',
	});
	Logger.debug(`Returned Data: ${responseData.length} bytes`);
	res.end(responseData);
}

// Function to log the request details after processing
export function logRequest(
	req: PyroRequest,
	res: PyroResponse,
	start: number
): void {
	const responseTime = Date.now() - start;
	Logger.http(req.method, res.statusCode, req.url, responseTime);
}
