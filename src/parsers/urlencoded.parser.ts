import { Middleware, NextFunction, FlexRequest, FlexResponse } from '@/types';

export function urlEncodedParser(): Middleware {
	return (req: FlexRequest, res: FlexResponse, next: NextFunction) => {
		if (req.method === 'GET') return next();
		if (!req.headers['content-type']) return next();
		if (
			!req.headers['content-type'].includes(
				'application/x-www-form-urlencoded'
			)
		)
			return next();

		let data = '';

		req.on('data', (chunk: any) => {
			data += chunk;
		});

		req.on('end', () => {
			const parsedData = new URLSearchParams(data);
			req.body = Object.fromEntries(parsedData);
			next();
		});
	};
}
