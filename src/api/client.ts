import createClient from "openapi-fetch";
import type { paths, components } from "./schema";

export type Health = components["schemas"]["Health"];

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string, public readonly requestId?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export function createApi(baseUrl = "") {
  const client = createClient<paths>({ baseUrl, credentials: "include" });
  return {
    async health(signal?: AbortSignal): Promise<Health> {
      const { data, error, response } = await client.GET("/api/health", { signal });
      if (error) throw new ApiError(response.status, error.error.code, error.error.message, error.error.requestId);
      if (!response.ok || !data) throw new ApiError(response.status, "INVALID_RESPONSE", "The service returned an unexpected response");
      return data;
    },
  };
}

export const api = createApi();
