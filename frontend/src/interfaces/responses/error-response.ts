export interface ErrorResponse {
    detail: {
        loc: string[],
        msg: string,
        type: string
    }[] | string;
}
