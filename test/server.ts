import { LogLevel } from '@/enums/loglevel.enum';
import { FlexServer } from '../src/core/flex';
import { AuthenticationController } from './controllers/authentication.controller';

const server = new FlexServer({
	logger: {
		level: LogLevel.debug,
	},
});

const controllers = [AuthenticationController];

server.register(...controllers);
server.listen(3000);
