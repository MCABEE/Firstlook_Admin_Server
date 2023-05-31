export interface IAppError {
    name?: string;
    statusCode: number;
    message: string;
    isOperational?: boolean;
}

class AppError extends Error {

    public readonly name: string;
    public readonly statusCode: number;
    public readonly isOperational: boolean = true;

    constructor(args: IAppError) {
        super(args.message)

        this.name = args.name || 'Error'
        this.statusCode = args.statusCode
        this.message = args.message
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError