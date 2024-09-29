import { Middleware, NextFunction, PyroRequest, PyroResponse } from '@/types';

export function urlEncodedParser(): Middleware {
	return (req: PyroRequest, res: PyroResponse, next: NextFunction) => {
		if (req.method !== 'POST') return next();
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
