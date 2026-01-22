export type GhostodonErrorCode =
  | "HTTP_ERROR"
  | "AUTH_ERROR"
  | "CONFIG_ERROR"
  | "STREAM_ERROR"
  | "UNKNOWN";

export class GhostodonError extends Error {
  public readonly code: GhostodonErrorCode;
  public readonly status?: number;
  public readonly cause?: unknown;

  constructor(args: { code: GhostodonErrorCode; message: string; status?: number; cause?: unknown }) {
    super(args.message);
    this.name = "GhostodonError";
    this.code = args.code;
    this.status = args.status;
    this.cause = args.cause;
  }
}

export function wrapError(err: unknown, fallbackCode: GhostodonErrorCode, fallbackMessage: string): GhostodonError {
  if (err instanceof GhostodonError) return err;
  if (err instanceof Error) return new GhostodonError({ code: fallbackCode, message: err.message, cause: err });
  return new GhostodonError({ code: fallbackCode, message: fallbackMessage, cause: err });
}
