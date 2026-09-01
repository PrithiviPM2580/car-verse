// ============================================================
// 🛡️ Multer Middleware — Handle multipart/form-data
// ============================================================

import type { RequestHandler } from "express";
import multer, { type FileFilterCallback, type Options } from "multer";
import { AppError } from "@/errors/app.error";
import logger from "@/utils/logger.util";

const storage = multer.memoryStorage();

// -----------------------------------------------------------------
// Obj:fileFilter — Desc: Filter to determine which files are allowed to be uploaded
// -----------------------------------------------------------------
const fileFilter: Options["fileFilter"] = (
	_req: Express.Request,
	file: Express.Multer.File,
	cb: FileFilterCallback,
) => {
	// Info: Check if the file's MIME type is in the allowed list
	const allowedMimeTypes = [
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/svg+xml",
		"image/jpg",
	];

	if (!allowedMimeTypes.includes(file.mimetype)) {
		logger.warn("Invalid file type uploaded", {
			label: "Multer Middleware",
			fileType: file.mimetype,
		});

		return cb(
			AppError.badRequest(
				`Invalid file type uploaded: ${file.mimetype}. Allowed types are: ${allowedMimeTypes.join(", ")}`,
			),
		);
	}

	cb(null, true);
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

export const uploadSingleFile = (fieldName: string): RequestHandler =>
	upload.single(fieldName);

export const uploadMultipleFiles = (
	fieldName: string,
	maxCount: number,
): RequestHandler => upload.array(fieldName, maxCount);

export const uploadfields = (
	fields: { name: string; maxCount?: number }[],
): RequestHandler => upload.fields(fields);

export default upload;
