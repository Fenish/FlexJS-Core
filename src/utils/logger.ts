import { FlexServer } from '../core/flex';
import { LogLevel } from '../enums/loglevel.enum';
import { IServerConfig } from '../interfaces/server-config.interface';

const COLORS = {
	green: '\x1b[32m',
	gray: '\x1b[90m',
	blue: '\x1b[34m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	reset: '\x1b[0m',
	bgCyan: '\x1b[46m',
	bgMagenta: '\x1b[45m',
	bgYellow: '\x1b[43m',
	bgBlue: '\x1b[44m',
	bgRed: '\x1b[41m',
	bgGreen: '\x1b[42m',
};

function printToConsole(type: string, message: string) {
	let prefixColor = COLORS.green;
	let messageColor = COLORS.gray;

	if (type === 'INFO') {
		prefixColor = COLORS.blue;
	} else if (type === 'WARN') {
		prefixColor = COLORS.yellow;
	} else if (type === 'ERROR') {
		prefixColor = COLORS.red;
	} else if (type === 'DEBUG') {
		prefixColor = COLORS.magenta;
		messageColor = COLORS.green;
	}

	const time = `${COLORS.gray}[${new Date().toLocaleString()}]${COLORS.reset}`;
	const prefix = `${prefixColor}[${type}]${COLORS.reset}`;
	const msg = `${messageColor}${message}${COLORS.reset}`;

	console.log(`${time} ${prefix} ${msg}`);
}

export class Logger {
	private static instance: Logger | null = null; // Static instance
	private loggerConfig: IServerConfig['logger'] | undefined;

	private constructor(app: FlexServer) {
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

	public static initialize(app: FlexServer) {
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
			method = `${COLORS.bgCyan} GET ${COLORS.reset}`;
		}

		if (method === 'POST') {
			method = `${COLORS.bgMagenta} POST ${COLORS.reset}`;
		}

		if (method === 'PUT') {
			method = `${COLORS.bgYellow} PUT ${COLORS.reset}`;
		}

		if (method === 'PATCH') {
			method = `${COLORS.bgBlue} PATCH ${COLORS.reset}`;
		}

		if (method === 'DELETE') {
			method = `${COLORS.bgRed} DELETE ${COLORS.reset}`;
		}

		if (status >= 200 && status < 300) {
			status = `${COLORS.bgGreen} ${status} ${COLORS.reset}`;
		} else if (status >= 400) {
			status = `${COLORS.bgRed} ${status} ${COLORS.reset}`;
		}

		const eventTime = `${COLORS.gray}[${new Date().toLocaleString()}]${COLORS.reset}`;
		const time = `${COLORS.yellow}${time_in_ms}ms${COLORS.reset}`;
		const msg = `${eventTime} ${method} ${status} ${path} ${time}`;

		if (this.instance?.checkLogLevel(this.instance, LogLevel.http)) {
			console.log(msg);
		}
	}
}
