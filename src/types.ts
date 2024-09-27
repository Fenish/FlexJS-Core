import { IncomingMessage, ServerResponse } from 'http';

export type PyroRequest = IncomingMessage;
export type PyroResponse = ServerResponse;
export type RouteHandler = (req: PyroRequest, res: PyroResponse) => Promise<void> | void;

export type Middleware = (req: PyroRequest, res: PyroResponse, next: () => void) => void;
