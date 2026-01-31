export class QueryError extends Error {
  name: string;
  constructor(message: string, name: string) {
    super(message);
    this.name = name;
  }
}
