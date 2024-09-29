import { Middleware, NextFunction, PyroRequest, PyroResponse } from '@/types';

export function bodyParser(): Middleware {
	return (req: PyroRequest, res: PyroResponse, next: NextFunction) => {
		if (req.method !== 'POST') return next();
		if (!req.headers['content-type']) return next();
		if (!req.headers['content-type'].includes('application/json'))
			return next();

		let data = '';

		req.on('data', (chunk) => {
			data += chunk;
		});

		req.on('end', () => {
			try {
				req.body = JSON.parse(data);

				next();
			} catch (error) {
				console.log(error);
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ error: 'Invalid JSON in Body' }));
			}
		});
	};
}
