import { Request, Response, NextFunction } from 'express';
import { IAppError } from '../util/appError';

export const errorHandler = (
    err: IAppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const name = err.name || 'Error';
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ name, message });
};

export default errorHandler;