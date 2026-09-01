// ============================================================
// 🛡️ Compression Middleware — Compress response bodies
// ============================================================

import zlib from "node:zlib";
import compression from "compression";
import type { Request, RequestHandler, Response } from "express";

// -----------------------------------------------------------------
// Fn:shouldCompress() — Desc: Determine if a response should be compressed
// -----------------------------------------------------------------
const shouldCompress = (req: Request, res: Response): boolean => {
	// Info: Don't compress if already compressed
	if (req.header("Content-Encoding")) return false;

	// Info: Don't compress if the request header indicates no compression
	if (req.headers["x-no-compression"]) return false;

	// Info: Don't compress if the response content type is not compressible
	const rawContentType = res.getHeader("Content-Type") || "";

	// Info: Convert the content type to a string and make it lowercase
	const type = Array.isArray(rawContentType)
		? rawContentType.join(";").toLowerCase()
		: rawContentType.toString().toLowerCase();

	// Info: Don't compress if the content type is one of the following: image, video, audio, zip, or pdf
	if (
		type.startsWith("image/") ||
		type.startsWith("video/") ||
		type.startsWith("audio/") ||
		type.startsWith("application/zip") ||
		type.startsWith("application/pdf")
	) {
		return false;
	}

	return compression.filter(req, res);
};

// -----------------------------------------------------------------
// Fn:compressionMiddleware() — Desc: Apply compression to the response
// -----------------------------------------------------------------
const compressionMiddleware: RequestHandler = compression({
	threshold: "1kb",
	zlib: {
		level: zlib.constants.Z_BEST_COMPRESSION,
	},
	brotli: {
		params: {
			[zlib.constants.BROTLI_PARAM_QUALITY]: 5,
		},
	},
	filter: shouldCompress,
	level: 6,
});

export default compressionMiddleware;
