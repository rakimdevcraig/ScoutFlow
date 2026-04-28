/** Thrown when the OpenRouter HTTP layer fails; used to trigger fallback model only. */
export class OpenRouterTransportError extends Error {
  override readonly name = "OpenRouterTransportError";

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
