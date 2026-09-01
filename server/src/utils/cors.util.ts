import cors, { type CorsOptions } from "cors";
import { appConfig } from "@/config/app.config";

const corsOptions: CorsOptions = {
	origin: appConfig.APP_ORIGIN,
	methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

export default cors(corsOptions);
