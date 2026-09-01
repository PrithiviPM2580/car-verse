import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { appConfig } from "@/config/app.config";
import { HTTP_STATUS } from "@/config/http.config";
import { AppError } from "@/errors/app.error";
import { formatZodError } from "@/errors/zod.error";
import logger from "@/utils/logger.util";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
	const isDevelopment = appConfig.NODE_ENV === "development";

	// ==========================================================
	// Invalid JSON body
	// ==========================================================

	if (err instanceof SyntaxError && "body" in err) {
		logger.warn("Invalid JSON payload", {
			method: req.method,
			path: req.path,
			message: err.message,
		});

		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: "Invalid JSON payload",

			...(isDevelopment && {
				error: err.message,
				stack: err.stack,
			}),
		});
	}

	// ==========================================================
	// Zod validation error
	// ==========================================================

	if (err instanceof ZodError) {
		logger.warn("Request validation failed", {
			method: req.method,
			path: req.path,
			issues: err.issues,
		});

		return formatZodError(res, err);
	}

	// ==========================================================
	// Known application error
	// ==========================================================

	if (err instanceof AppError) {
		logger.error("Application error", {
			method: req.method,
			path: req.path,
			statusCode: err.statusCode,
			errorCode: err.errorCode,
			message: err.message,
			stack: err.stack,
		});

		return res.status(err.statusCode).json({
			message: err.message,
			errorCode: err.errorCode,

			...(isDevelopment && {
				stack: err.stack,
			}),
		});
	}

	// ==========================================================
	// Unknown / unexpected error
	// ==========================================================

	logger.error("Unexpected server error", {
		method: req.method,
		path: req.path,
		message: err instanceof Error ? err.message : String(err),
		stack: err instanceof Error ? err.stack : undefined,
	});

	// ==========================================================
	// Response
	// ==========================================================

	return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
		message: isDevelopment
			? err instanceof Error
				? err.message
				: "Internal Server Error"
			: "An unexpected error occurred. Please try again later.",

		...(isDevelopment &&
			err instanceof Error && {
				stack: err.stack,
			}),
	});
};
