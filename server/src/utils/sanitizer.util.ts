import mongoSanitizer from "@exortek/express-mongo-sanitize";
import { appConfig } from "@/config/app.config";

export const sanitize = () =>
	mongoSanitizer({
		recursive: true,
		maxDepth: 20,
		maxDepthBehavior: appConfig.NODE_ENV === "production" ? "remove" : "throw",
		allowPrototypeKeys: appConfig.NODE_ENV !== "production",
		preserveEmails: appConfig.NODE_ENV !== "production",
	});
