import { IncomingMessage, ServerResponse } from 'http';

export interface FlexRequest extends IncomingMessage {
	body?: any;
	params?: any;
	query?: any;
}
export class FlexResponse extends ServerResponse {}

export type NextFunction = () => void;

export type RouteHandler = (
	req: FlexRequest,
	res: FlexResponse
) => Promise<void> | void;

export type Middleware = (
	req: FlexRequest,
	res: FlexResponse,
	next: () => void
) => void;
