import { Middleware, RouteHandler } from '@/types';

export interface IRoute {
	method: string;
	path: string;
	status: number;
	handler: RouteHandler;
	middlewares: Middleware[];
}
