export function sse(url: string, options: EventSourceInit = {}): EventSource {
  return new EventSource(url, {
    withCredentials: true,
    ...options,
  });
}
