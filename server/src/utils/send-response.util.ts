// ============================================================
// 🔨 Send Response Utility —
// ============================================================

import type { Response } from "express";
import logger from "./logger.util";

// -----------------------------------------------------------------
// Fn:sendResponse() — Desc: Sends a standardized response
// -----------------------------------------------------------------
export const sendResponse = <T>(
	res: Response,
	statusCode: number = 200,
	message: string = "success",
	data?: T,
) => {
	// Info: Log the response details for debugging and monitoring purposes
	logger.info(`Success Response: ${message}`, {
		label: "Success Response",
		data: data,
	});

	// Info: Return a standardized JSON response to the client
	return res.status(statusCode).json({
		success: true,
		statusCode,
		message,
		data,
	});
};
