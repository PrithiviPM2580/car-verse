// ============================================================
// 🛣️ Routes — API route definitions
// ============================================================

import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import mongoose from "mongoose";
import { appConfig } from "@/config/app.config";
import logger from "@/utils/logger.util";
import { sendResponse } from "@/utils/send-response.util";

// ------------------------------------------------------
//  Router: Router instance
// ------------------------------------------------------
const router: Router = Router();

// ------------------------------------------------------
//  Root Route
// ------------------------------------------------------
// @desc GET API status
// @route GET /
// @access Public
router.route("/").get((_req: Request, res: Response, next: NextFunction) => {
	try {
		// Info: Send a standardized response indicating that the API is running successfully, along with relevant application details
		sendResponse(res, 200, "Car Verse API is running successfully", {
			appName: appConfig.APP_NAME,
			status: process.uptime() > 0 ? "Running" : "Stopped",
			timestamp: new Date().toISOString(),
			version: appConfig.APP_VERSION,
			env: appConfig.NODE_ENV,
		});
	} catch (error) {
		// ERROR: Error handling for root route, logging the error details for debugging and monitoring purposes
		logger.error("Errror in root route", {
			label: "Root Route",
			error,
		});

		next(error);
	}
});

// ------------------------------------------------------
//  Health Route
// ------------------------------------------------------
// @desc Health Check
// @route GET /health
// @access Public
router
	.route("/health")
	.get((_req: Request, res: Response, next: NextFunction) => {
		try {
			// Info: Database connection state check
			const dbState =
				mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

			// Info: Send a standardized response indicating the health status of the application, including database connection state, uptime, memory usage, and timestamp
			sendResponse(res, 200, "Health check successful", {
				status: "ok",
				service: appConfig.APP_NAME,
				environment: appConfig.NODE_ENV,
				database: dbState,
				uptime: process.uptime(),
				memoryusage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
				timestamp: new Date().toISOString(),
			});
		} catch (error) {
			// ERROR: Error handling for health route, logging the error details for debugging and monitoring purposes
			logger.error("Error in health route", {
				label: "Health Route",
				error,
			});

			next(error);
		}
	});

export default router;
