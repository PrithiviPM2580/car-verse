// ============================================================
// 🚀 App — Application setup and configuration
// ============================================================

import express, { type Application } from "express";
import helmet from "helmet";
import hpp from "hpp-clean";
import cors from "./utils/cors.util";
import morganOptions from "./utils/morgan.util";
import sanitize from "./utils/sanitizer.util";

// ------------------------------------------------------
//  App: Application instance
// ------------------------------------------------------
const app: Application = express();

// ------------------------------------------------------
//  Subsection Name
// ------------------------------------------------------
app.use(helmet());
app.use(cors);
app.use(sanitize());
app.use(morganOptions);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(hpp({ keepFirst: true }));

export default app;
