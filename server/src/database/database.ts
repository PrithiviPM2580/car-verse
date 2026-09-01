// ============================================================
// 🗄️ Database — Database connection and configuration
// ============================================================

import type { Server } from "node:http";
import mongoose, { type ConnectOptions } from "mongoose";
import { appConfig } from "@/config/app.config";
import { AppError } from "@/errors/app.error";
import logger from "@/utils/logger.util";

// -----------------------------------------------------------------
// Obj:connectOptions — Desc: Options for connecting to the MongoDB database
// -----------------------------------------------------------------
const connectOptions: ConnectOptions = {
	dbName: appConfig.DB_NAME, // Database name from environment variables
	appName: appConfig.APP_NAME, // Application name from environment variables
	serverApi: {
		version: "1", // Use Server API version 1
		strict: true, // Enforce strict mode for server API
		deprecationErrors: true, // Report deprecated features as errors
	},
	maxPoolSize: 50, // Maximum number of connections in the pool
	minPoolSize: 1, // Minimum number of connections in the pool
	connectTimeoutMS: 10000, // Connection timeout in milliseconds
	socketTimeoutMS: 45000, // Socket timeout in milliseconds
	retryWrites: true, // Enable retryable writes
};

let isConnected = false;

export const connectToDatabase = async () => {
	if (isConnected) return mongoose.connection;

	try {
		await mongoose.connect(appConfig.MONGODB_URI, connectOptions);
		isConnected = true;
		logger.info("Connected to database successfully", {
			label: "Database",
		});
	} catch (error) {
		logger.error("Error connecting to database:", error, {
			label: "Database",
		});
		throw AppError.badRequest("Error connecting to database");
	}
};

export const disconnectFromDatabase = async () => {
	if (!isConnected) return;

	try {
		await mongoose.disconnect();
		isConnected = false;
		logger.info("Disconnected from database successfully", {
			label: "Database",
		});
	} catch (error) {
		logger.error("Error disconnecting from database:", error, {
			label: "Database",
		});
		throw AppError.badRequest("Error disconnecting from database");
	}
};

export const gracefulShutdown = async (server: Server) => {
	try {
		await disconnectFromDatabase();

		logger.info("Shutting down server gracefully...", {
			label: "Server",
		});
	} catch (error) {
		logger.error("Error during graceful shutdown:", error, {
			label: "Server",
		});
		throw AppError.badRequest("Error during graceful shutdown");
	} finally {
		server.close(() => {
			logger.info("Server closed successfully", {
				label: "Server",
			});
			process.exit(0);
		});
	}
};
