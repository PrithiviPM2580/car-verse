import { doubleCsrf } from "csrf-csrf";
import type { Request } from "express";
import { appConfig } from "@/config/app.config";

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
	getSecret: () => appConfig.CSRF_SECRET,
	getSessionIdentifier: (req: Request) => req.ip ?? "unknown",
	cookieName: "csrfToken",
	cookieOptions: {
		httpOnly: false,
		secure: appConfig.NODE_ENV === "production",
		sameSite: appConfig.NODE_ENV === "production" ? "strict" : "lax",
	},
	getCsrfTokenFromRequest: (req: Request) =>
		req.headers["x-csrf-token"] as string,
});

export { doubleCsrfProtection, generateCsrfToken };
