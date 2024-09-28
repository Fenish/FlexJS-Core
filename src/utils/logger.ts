import chalk from 'chalk';
import { PyroServer } from '../core/pyro';
import { IServerConfig } from '@/interfaces/IServerConfig';
import { LogLevel } from '@/enums/loglevel';

export class Logger {
	private static instance: Logger | null = null; // Static instance
	private loggerConfig: IServerConfig['logger'] | undefined;

	private constructor(app: PyroServer) {
		this.loggerConfig = app.config?.logger;
	}

	private checkLogLevel(
		instance: Logger,
		level: LogLevel = LogLevel.info
	): boolean {
		if (!instance.loggerConfig) {
			instance.loggerConfig = {
				level: LogLevel.info,
			};
		}

		if (instance.loggerConfig?.level === 'off') return false;

		const levels = Object.values(LogLevel);
		const levelIndex = levels.indexOf(level);

		const spliced = levels.slice(0, levelIndex + 1);
		if (spliced.indexOf(instance.loggerConfig?.level) === -1) {
			return false;
		}

		return true;
	}

	public static initialize(app: PyroServer) {
		if (!Logger.instance) {
			Logger.instance = new Logger(app);
		}
	}

	public static error(message: string) {
		const prefix = chalk.red('[ERROR]');
		const msg = chalk.redBright(message);

		if (this.instance?.checkLogLevel(this.instance, LogLevel.error)) {
			console.error(`${prefix} ${msg}`);
		}
	}

	public static warn(message: string) {
		const prefix = chalk.yellow('[WARN]');
		const msg = chalk.yellowBright(message);

		if (this.instance?.checkLogLevel(this.instance, LogLevel.warn)) {
			console.warn(`${prefix} ${msg}`);
		}
	}

	public static info(message: string) {
		const prefix = chalk.blue('[INFO]');
		const msg = chalk.gray(message);

		if (this.instance?.checkLogLevel(this.instance, LogLevel.info)) {
			console.log(`${prefix} ${msg}`);
		}
	}

	public static debug(message: string) {
		const prefix = chalk.magenta('[DEBUG]');
		const msg = chalk.greenBright(message);

		if (this.instance?.checkLogLevel(this.instance, LogLevel.debug)) {
			console.debug(`${prefix} ${msg}`);
		}
	}
}
