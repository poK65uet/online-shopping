enum STATUS_CODES {
	SUCCESS = 200,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500
}

class BaseError extends Error {
	public readonly name: string;
	public readonly statusCode: number;
	public readonly description: string;
	public readonly isOperational: boolean;

	constructor(
		name: string,
		statusCode: number,
		description: string,
		isOperational: boolean
	) {
		super(description);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = name;
		this.statusCode = statusCode;
		this.description = description;
		this.isOperational = isOperational;
		Error.captureStackTrace(this);
	}
}

class APIError extends BaseError {
	constructor(
		name: string,
		statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR,
		description = "Internal Server Error",
		isOperational = true
	) {
		super(name, statusCode, description, isOperational);
	}
}

class BadRequestError extends BaseError {
	constructor(description = "Bad Request") {
		super("NOT FOUND", STATUS_CODES.BAD_REQUEST, description, true);
	}
}

//400
class ValidationError extends BaseError {
	constructor(description = "Validation Error") {
		super("BAD REQUEST", STATUS_CODES.BAD_REQUEST, description, true);
	}
}

export { STATUS_CODES, BaseError, APIError, BadRequestError, ValidationError };
