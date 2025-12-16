export async function call<T = unknown>(
  url: string,
  data: unknown,
  options: RequestInit = {}
): Promise<T | string | null> {
  try {
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers as HeadersInit),
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    const text: string = await res.text();

    if (!res.ok) {
      throw text || res.statusText || "REQUEST_FAILED";
    }

    try {
      return text ? (JSON.parse(text) as T) : null;
    } catch {
      return text;
    }
  } catch (err: unknown) {
    if (typeof err === "string") throw err;
    if (err instanceof Error) throw err.message || "CONNECTION_LOST";
    throw "CONNECTION_LOST";
  }
}
