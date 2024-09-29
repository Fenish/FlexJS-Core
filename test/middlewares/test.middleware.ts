export function TestMiddleware(req: any, res: any, next: Function) {
	req.user = 'Test user';
	next();
}
