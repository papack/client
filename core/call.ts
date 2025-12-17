export async function call<T = unknown>(
  url: string,
  data: unknown,
  options: RequestInit = {}
): Promise<T | string | null> {
  try {
    const res = await fetch(url, {
      ...options,
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers as HeadersInit),
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    const text = await res.text();

    let parsed: T | string | null;
    try {
      parsed = text ? (JSON.parse(text) as T) : null;
    } catch {
      parsed = text;
    }

    if (!res.ok) {
      if (typeof parsed === "string" && parsed) {
        throw parsed;
      }
      throw "REQUEST_FAILED";
    }

    return parsed;
  } catch (err: unknown) {
    let msg = "CONNECTION_LOST";

    if (err instanceof Error && err.message) {
      msg = err.message;
    } else if (typeof err === "string") {
      msg = err;
    }

    throw msg
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }
}
