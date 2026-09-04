export class HttpError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(String(message));
        this.status = status;
        this.name = this.constructor.name;
    }
}