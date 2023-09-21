import { createLogger, format, transports } from "winston";
import { BaseError } from ".";
import { NextFunction, Request, Response } from "express";

const logger = createLogger({
	level: "info",
	format: format.simple(),
	transports: [
		new transports.File({ filename: "app_errors.log", level: "error" }),
		new transports.Console({ level: "error" })
	]
});

if (process.env.NODE_ENV !== "prod") {
	logger.add(
		new transports.Console({
			format: format.simple()
		})
	);
}

class ErrorLogger {
	constructor() {}
	async logError(error: Error) {
		console.log("==================== Start Error Logger ===============");
		logger.log({
			private: true,
			level: "error",
			message: `${new Date()}-${JSON.stringify(error)}`
		});
		console.log("==================== End Error Logger ===============");
	}

	isTrustError(error: Error) {
		if (error instanceof BaseError) {
			return error.isOperational;
		}
		return false;
	}
}

const handlerError = async (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errorLogger = new ErrorLogger();

	process.on("uncaughtRejection", (reason, promise) => {
		console.log(reason, "UNHANDLED");
		throw reason; // need to take care
	});

	process.on("uncaughtException", (error) => {
		errorLogger.logError(error);
		if (!errorLogger.isTrustError(error)) {
			process.exit(1);
			//process exist // need restart
		}
	});

	if (error instanceof BaseError) {
		await errorLogger.logError(error);
		if (errorLogger.isTrustError(error)) {
			return res.status(error.statusCode).json({ message: error.stack });
		} else {
			process.exit(1);
		}
	}
	next();
};

export { handlerError };
