import { FlexRequest, FlexResponse, Middleware, NextFunction } from '@/types';

export function queryParser(): Middleware {
	return async (req: FlexRequest, _res: FlexResponse, next: NextFunction) => {
		const url = new URL(req.url || '/', `http://${req.headers.host}`);
		const queryParams = Object.fromEntries(url.searchParams);
		req.query = queryParams;
		next();
	};
}
