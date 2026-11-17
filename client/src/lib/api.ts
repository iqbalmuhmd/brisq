export class ApiRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const url = `/api${path}`;

  const headers: Record<string, string> = {};
  let requestBody: BodyInit | undefined;

  if (options.body instanceof FormData) {
    requestBody = options.body;
  } else if (options.body !== undefined) {
    requestBody = JSON.stringify(options.body);
    headers["Content-Type"] = "application/json";
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: options.method,
      headers,
      body: requestBody,
    });
  } catch {
    throw new ApiRequestError(
      0,
      "Can't reach the server. Check your connection.",
    );
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok) {
    throw new ApiRequestError(
      res.status,
      json?.message ?? `Request failed (${res.status})`,
    );
  }

  if (!json) {
    throw new ApiRequestError(res.status, "Unexpected response from server.");
  }

  return json.data as T;
}
