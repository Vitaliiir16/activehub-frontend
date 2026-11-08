import createClient from "openapi-fetch";
import type { paths, components } from "./schema";

export type Health = components["schemas"]["Health"];
export type Profile = components["schemas"]["Profile"];
export type Dictionary = components["schemas"]["Dictionary"];
export type Settings = components["schemas"]["NotificationSettings"];
export type UserRegistration = components["schemas"]["UserRegistration"];
export type OrganizerRegistration =
  components["schemas"]["OrganizerRegistration"];
export type ProfilePatch = components["schemas"]["ProfilePatch"];
export type Notice = components["schemas"]["Notification"];

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
    public readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createApi(baseUrl = "") {
  const client = createClient<paths>({
    baseUrl,
    credentials: "include",
    fetch: (request) =>
      fetch(request, {
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(15000)]),
      }),
  });
  function result<T>(value: {
    data?: T;
    error?: unknown;
    response: Response;
  }): T {
    if (!value.response.ok) {
      if (
        value.response.status === 401 &&
        !value.response.url.endsWith("/api/auth/login") &&
        typeof window !== "undefined"
      )
        window.dispatchEvent(new Event("activehub:session-ended"));
      const error = value.error as components["schemas"]["Error"] | undefined;
      throw new ApiError(
        value.response.status,
        error?.error.code ?? "INVALID_RESPONSE",
        error?.error.message ?? "The service returned an unexpected response",
        error?.error.requestId,
        error?.error.fields,
      );
    }
    return value.data as T;
  }
  let queue: Promise<unknown> = Promise.resolve();
  function mutate<T>(
    action: (headers: { "X-CSRF-Token": string }) => Promise<T>,
  ): Promise<T> {
    const task = queue
      .catch(() => undefined)
      .then(async () => {
        const csrf = result(await client.GET("/api/auth/csrf"));
        return action({ "X-CSRF-Token": csrf.token });
      });
    queue = task;
    return task;
  }
  return {
    async health(signal?: AbortSignal): Promise<Health> {
      const { data, error, response } = await client.GET("/api/health", {
        signal,
      });
      if (error)
        throw new ApiError(
          response.status,
          error.error.code,
          error.error.message,
          error.error.requestId,
        );
      if (!response.ok || !data)
        throw new ApiError(
          response.status,
          "INVALID_RESPONSE",
          "The service returned an unexpected response",
        );
      return data;
    },
    async session() {
      return result(await client.GET("/api/auth/session"));
    },
    async profile() {
      return result(await client.GET("/api/me"));
    },
    login(body: components["schemas"]["Login"]) {
      return mutate(async (headers) =>
        result(await client.POST("/api/auth/login", { headers, body })),
      );
    },
    registerUser(body: UserRegistration) {
      return mutate(async (headers) =>
        result(await client.POST("/api/auth/register/user", { headers, body })),
      );
    },
    registerOrganizer(body: OrganizerRegistration) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/auth/register/organizer", { headers, body }),
        ),
      );
    },
    logout() {
      return mutate(async (headers) =>
        result(await client.POST("/api/auth/logout", { headers })),
      );
    },
    updateProfile(body: ProfilePatch) {
      return mutate(async (headers) =>
        result(await client.PATCH("/api/me", { headers, body })),
      );
    },
    changePassword(body: components["schemas"]["PasswordChange"]) {
      return mutate(async (headers) =>
        result(await client.POST("/api/me/password", { headers, body })),
      );
    },
    async settings() {
      return result(await client.GET("/api/me/notification-settings"));
    },
    updateSettings(body: Settings) {
      return mutate(async (headers) =>
        result(
          await client.PATCH("/api/me/notification-settings", {
            headers,
            body,
          }),
        ),
      );
    },
    async dictionaries(name: "cities" | "directions", includeSelected = false) {
      const items: Dictionary[] = [];
      let page = 1;
      while (true) {
        const response = result(
          await client.GET(
            name === "cities" ? "/api/cities" : "/api/directions",
            { params: { query: { page, pageSize: 100, includeSelected } } },
          ),
        );
        items.push(...response.items);
        if (page >= response.meta.totalPages) break;
        page++;
      }
      return items;
    },
    uploadPhoto(file: File) {
      return mutate(async (headers) => {
        const body = new FormData();
        body.set("file", file);
        const response = await fetch(baseUrl + "/api/me/photo", {
          method: "POST",
          credentials: "include",
          headers,
          body,
        });
        const data = await response.json();
        return result<components["schemas"]["Photo"]>({
          response,
          ...(response.ok ? { data } : { error: data }),
        });
      });
    },
    createAdmin(body: components["schemas"]["AdminCreate"]) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/admin/administrators", { headers, body }),
        ),
      );
    },
    setAdminStatus(id: string, body: components["schemas"]["StatusChange"]) {
      return mutate(async (headers) =>
        result(
          await client.PATCH("/api/admin/administrators/{id}/status", {
            headers,
            params: { path: { id } },
            body,
          }),
        ),
      );
    },
    async notifications(page = 1) {
      return result(
        await client.GET("/api/notifications", {
          params: { query: { page, pageSize: 20 } },
        }),
      );
    },
    readNotification(id: string) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/notifications/{id}/read", {
            headers,
            params: { path: { id } },
          }),
        ),
      );
    },
    readAllNotifications() {
      return mutate(async (headers) =>
        result(await client.POST("/api/notifications/read-all", { headers })),
      );
    },
  };
}

export const api = createApi();
