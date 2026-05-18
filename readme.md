# @papack/client

Minimal HTTP client utilities for the browser.

Provides exactly two primitives:

- `call` - JSON-first POST requests with predictable error handling
- `sse` - thin wrapper around `EventSource`
- `upload` - direct file uploads with normalized string errors

No abstractions beyond what the platform already gives you.

## Install

```bash
npm install @papack/client
```

## API

### call

Typed POST request helper.

```ts
import { call } from "@papack/client";

const result = await call<User>("/api/user", { id: 1 });
```

#### Behavior

- Always uses `POST`
- Automatically sets `Content-Type: application/json`
- Merges custom `fetch` options
- Sends `data` as JSON (if provided)
- Reads response as text first
- Parses JSON when possible
- Falls back to raw text

#### Error handling

- Non-OK responses throw the response body (text) if available
- Network or parsing failures throw string errors
- No wrapped error objects
- No silent failures

You either get a value or a thrown error.

### upload

Direct file upload helper.

```ts
import { upload } from "@papack/client";

const file = input.files?.[0];

if (file) {
  const result = await upload("/api/upload", file);
}
```

#### Behavior

- Always uses `POST`
- Sends the raw `File` directly as the request body
- Automatically uses the file MIME type as `Content-Type` when available
- Includes credentials by default
- Merges custom `fetch` options
- Reads response as text first
- Parses JSON when possible
- Falls back to raw text

#### Error handling

- Non-OK responses throw the response body (text) if available
- Unknown failures throw normalized uppercase string errors
- Errors are converted into stable machine-readable values

Example:

```txt
UPLOAD_FAILED
CONNECTION_LOST
INVALID_FILE
```

### sse

Thin wrapper around `EventSource`.

```ts
import { sse } from "@papack/client";

const events = sse("/api/events");

events.onmessage = (e) => {
  console.log(e.data);
};
```
