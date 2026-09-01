import morgan from "morgan";
import { appConfig } from "@/config/app.config";
import logger from "./logger.util";

const morganFormat = appConfig.NODE_ENV === "development" ? "dev" : "combined";

const morganOptions = morgan(morganFormat, {
	stream: {
		write: (message: string) => {
			logger.info(message.trim(), { label: "HTTP" });
		},
	},
	skip: () => appConfig.NODE_ENV === "test",
});

export default morganOptions;
