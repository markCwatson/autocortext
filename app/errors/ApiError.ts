class ApiError extends Error {
  public code: number;
  public explanation: string | null;

  constructor({
    code,
    message,
    explanation,
  }: {
    code: number;
    message: string;
    explanation: string | null;
  }) {
    super(message);
    this.code = code;
    this.explanation = explanation;
  }
}

export default ApiError;
