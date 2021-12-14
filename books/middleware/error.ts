export default function (error: any, request: any, response: any, next: Function) {
    return response.status(500).json({
        error: error.toString(),
    });
}