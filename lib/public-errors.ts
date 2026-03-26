function getErrorMessage(error: unknown) {
  if (!error) {
    return "";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    return `${"message" in error ? String(error.message ?? "") : ""} ${
      "details" in error ? String(error.details ?? "") : ""
    }`.trim();
  }

  return "";
}

type PublicErrorOptions = {
  fallback: string;
  setupMessage?: string;
  setupFragments?: string[];
  duplicateMessage?: string;
  duplicateFragments?: string[];
  closedMessage?: string;
  closedFragments?: string[];
  rateLimitMessage?: string;
  rateLimitFragments?: string[];
};

export function toPublicErrorMessage(error: unknown, options: PublicErrorOptions) {
  const message = getErrorMessage(error).toLowerCase();

  if (
    options.setupMessage &&
    options.setupFragments?.some((fragment) => message.includes(fragment.toLowerCase()))
  ) {
    return options.setupMessage;
  }

  if (
    options.duplicateMessage &&
    options.duplicateFragments?.some((fragment) => message.includes(fragment.toLowerCase()))
  ) {
    return options.duplicateMessage;
  }

  if (
    options.closedMessage &&
    options.closedFragments?.some((fragment) => message.includes(fragment.toLowerCase()))
  ) {
    return options.closedMessage;
  }

  if (
    options.rateLimitMessage &&
    options.rateLimitFragments?.some((fragment) => message.includes(fragment.toLowerCase()))
  ) {
    return options.rateLimitMessage;
  }

  return options.fallback;
}

export function toRedirectErrorParam(message: string) {
  return encodeURIComponent(message);
}
