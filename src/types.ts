import { IncomingMessage, ServerResponse } from 'http';

export interface FlexRequest extends IncomingMessage {
	body?: any;
}
export class FlexResponse extends ServerResponse {
	// send(status: number, data: any): void {
	// 	const headers = this.getHeaders();
	// 	console.log(headers);
	// 	this.setHeader('Content-Type', 'application/json');
	// 	this.end(JSON.stringify(data));
	// }
}

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
