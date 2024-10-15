export class NotAnAdminError extends Response {
  constructor() {
    super('User is not an Admin.', { status: 403 })
  }
}
