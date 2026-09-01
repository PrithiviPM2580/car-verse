import type { NextFunction, Response } from "express";
import type { TypeRequest } from "@/types";

type AsyncController = (
	req: TypeRequest,
	res: Response,
	next: NextFunction,
) => Promise<Response | undefined>;

export const asyncHandler = (controller: AsyncController) => {
	return async (
		req: TypeRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			await controller(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};
