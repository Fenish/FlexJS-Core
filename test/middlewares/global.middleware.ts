export function GlobalMiddlewareTest(req: any, res: any, next: Function) {
	console.log('Global middleware');
	next();
}
