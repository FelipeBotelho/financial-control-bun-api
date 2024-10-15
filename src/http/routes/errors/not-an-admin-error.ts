export class NotAnAdminError extends Error {
  constructor() {
    super('User is not an Admin')
  }
}
