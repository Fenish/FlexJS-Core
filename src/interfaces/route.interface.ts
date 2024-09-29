import {
	METHOD_SYMBOL,
	MIDDLEWARE_SYMBOL,
	ROUTE_HANDLER_SYMBOL,
	ROUTE_PATH_SYMBOL,
	STATUS_SYMBOL,
} from '@/decorators/symbols';
import { Middleware, RouteHandler } from '@/types';

export interface IRoute {
	[ROUTE_PATH_SYMBOL]: string;
	[METHOD_SYMBOL]: string;
	[ROUTE_HANDLER_SYMBOL]: RouteHandler;
	[MIDDLEWARE_SYMBOL]?: Middleware[];
	[STATUS_SYMBOL]?: number;
}
