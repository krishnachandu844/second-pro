import type { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}
export declare const authMiddleWare: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=middleware.d.ts.map