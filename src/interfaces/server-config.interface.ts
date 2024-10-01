import { LogLevel } from '../enums/loglevel.enum';

export interface IServerConfig {
	logger: {
		level: LogLevel;
	};

	swagger?: {
		path: string;
		enable: boolean;
		title?: string;
		version?: string;
		description?: string;
		host?: string;
	};
}
