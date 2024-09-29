import { LogLevel } from '@/enums/loglevel.enum';
import { IServerConfig } from '@/interfaces/server-config.interface';
import chalk from 'chalk';
import { PyroServer } from '../core/pyro';

function printToConsole(type: string, message: string) {
	let prefixColor = chalk.green;
	let messageColor = chalk.gray;

	if (type === 'INFO') {
		prefixColor = chalk.blueBright;
	} else if (type === 'WARN') {
		prefixColor = chalk.yellow;
	} else if (type === 'ERROR') {
		prefixColor = chalk.red;
	} else if (type === 'DEBUG') {
		prefixColor = chalk.magenta;
		messageColor = chalk.greenBright;
	}

	const time = chalk.gray(`[${new Date().toLocaleString()}]`);

	const prefix = prefixColor(`[${type}]`);
	const msg = messageColor(message);
	console.log(`${time} ${prefix} ${msg}`);
}

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
		if (this.instance?.checkLogLevel(this.instance, LogLevel.error)) {
			printToConsole('ERROR', message);
		}
	}

	public static warn(message: string) {
		if (this.instance?.checkLogLevel(this.instance, LogLevel.warn)) {
			printToConsole('WARN', message);
		}
	}

	public static info(message: string) {
		if (this.instance?.checkLogLevel(this.instance, LogLevel.info)) {
			printToConsole('INFO', message);
		}
	}

	public static debug(message: string) {
		if (this.instance?.checkLogLevel(this.instance, LogLevel.debug)) {
			printToConsole('DEBUG', message);
		}
	}

	public static http(
		method: string | undefined,
		status: any,
		path: string | undefined,
		time_in_ms: number
	) {
		if (method === 'GET') {
			method = chalk.bgCyanBright(' GET ');
		}

		if (method === 'POST') {
			method = chalk.bgMagentaBright(' POST ');
		}

		if (method === 'PUT') {
			method = chalk.bgYellowBright(' PUT ');
		}

		if (method === 'PATCH') {
			method = chalk.bgBlueBright(' PATCH ');
		}

		if (method === 'DELETE') {
			method = chalk.bgRedBright(' DELETE ');
		}

		if (status >= 200 && status < 300) {
			status = chalk.bgGreenBright(` ${status} `);
		} else if (status >= 400) {
			status = chalk.bgRedBright(` ${status} `);
		}
		const eventTime = chalk.gray(`[${new Date().toLocaleString()}]`);

		const time = chalk.yellowBright(`${time_in_ms}ms`);
		const msg = `${eventTime} ${method} ${status} ${path} ${time}`;

		if (this.instance?.checkLogLevel(this.instance, LogLevel.http)) {
			console.log(msg);
		}
	}
}
