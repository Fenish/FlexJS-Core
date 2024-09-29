import { LogLevel } from '@/enums/loglevel.enum';
import { PyroServer } from '../src/core/pyro';
import { AuthenticationController } from './controllers/authentication.controller';

const server = new PyroServer({
	logger: {
		level: LogLevel.debug,
	},
});

const controllers = [AuthenticationController];

server.register(...controllers);
server.listen(3000);
