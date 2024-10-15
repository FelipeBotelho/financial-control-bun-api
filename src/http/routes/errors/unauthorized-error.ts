export class UnauthorizedError extends Response {
  constructor() {
    super('Unauthorized', { status: 401 })
  }
}
