import {
	FUNCTION_PARAMETERS_METADATA_KEY,
	METHOD_METADATA_KEY,
	MIDDLEWARE_METADATA_KEY,
	ROUTE_HANDLER_METADATA_KEY,
	ROUTE_PATH_METADATA_KEY,
	STATUS_METADATA_KEY,
} from '@/metadata-keys';
import { Middleware, RouteHandler } from '@/types';

export interface IRoute {
	[ROUTE_PATH_METADATA_KEY]: string;
	[METHOD_METADATA_KEY]: string;
	[ROUTE_HANDLER_METADATA_KEY]: RouteHandler;
	[MIDDLEWARE_METADATA_KEY]?: Middleware[];
	[STATUS_METADATA_KEY]?: number;
	[FUNCTION_PARAMETERS_METADATA_KEY]?: any;
	parameters: [];
}
