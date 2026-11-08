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
export type Booking = components["schemas"]["Booking"];
export type OrganizerBooking = components["schemas"]["OrganizerBooking"];
export type Event = components["schemas"]["Event"];
export type EventSession = components["schemas"]["EventSession"];
export type Organizer = components["schemas"]["OrganizerPublic"];
export type Conversation = components["schemas"]["Conversation"];
export type ChatMessage = components["schemas"]["Message"];
export type LoyaltyLevel = components["schemas"]["LoyaltyLevel"];
export type LoyaltyRules = components["schemas"]["LoyaltyRules"];
export type LoyaltySummary = components["schemas"]["LoyaltySummary"];
export type PointsTransaction = components["schemas"]["PointsTransaction"];

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
    async loyalty() {
      return result(await client.GET("/api/me/loyalty"));
    },
    async pointsTransactions(
      query: paths["/api/me/points-transactions"]["get"]["parameters"]["query"] = {},
    ) {
      return result(
        await client.GET("/api/me/points-transactions", { params: { query } }),
      );
    },
    async loyaltyLevels() {
      return result(await client.GET("/api/admin/loyalty/levels"));
    },
    setLoyaltyLevel(body: LoyaltyLevel) {
      return mutate(async (headers) =>
        result(
          await client.PUT("/api/admin/loyalty/levels/{level}", {
            headers,
            params: { path: { level: body.level } },
            body,
          }),
        ),
      );
    },
    async loyaltyRules() {
      return result(await client.GET("/api/admin/loyalty/rules"));
    },
    setLoyaltyRules(body: LoyaltyRules) {
      return mutate(async (headers) =>
        result(
          await client.PUT("/api/admin/loyalty/rules", { headers, body }),
        ),
      );
    },
    assignCard(id: string, body: components["schemas"]["CardAssignment"]) {
      return mutate(async (headers) =>
        result(
          await client.PATCH("/api/admin/users/{id}/card", {
            headers,
            params: { path: { id } },
            body,
          }),
        ),
      );
    },
    adjustPoints(
      id: string,
      body: components["schemas"]["PointsAdjustment"],
      key: string,
    ) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/admin/users/{id}/points-adjustments", {
            headers,
            params: { path: { id }, header: { "Idempotency-Key": key } },
            body,
          }),
        ),
      );
    },
    async plans(organizerId?: string, page = 1) {
      return organizerId
        ? result(
            await client.GET("/api/organizers/{id}/plans", {
              params: {
                path: { id: organizerId },
                query: { page, pageSize: 20 },
              },
            }),
          )
        : result(
            await client.GET("/api/organizer/subscription-plans", {
              params: { query: { page, pageSize: 20 } },
            }),
          );
    },
    async plan(id: string) {
      return result(
        await client.GET("/api/subscription-plans/{id}", {
          params: { path: { id } },
        }),
      );
    },
    savePlan(body: components["schemas"]["PlanWrite"], id?: string) {
      return mutate(async (headers) =>
        id
          ? result(
              await client.PATCH("/api/organizer/subscription-plans/{id}", {
                headers,
                params: { path: { id } },
                body,
              }),
            )
          : result(
              await client.POST("/api/organizer/subscription-plans", {
                headers,
                params: { header: { "Idempotency-Key": crypto.randomUUID() } },
                body,
              }),
            ),
      );
    },
    archivePlan(id: string) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/organizer/subscription-plans/{id}/archive", {
            headers,
            params: {
              path: { id },
              header: { "Idempotency-Key": crypto.randomUUID() },
            },
          }),
        ),
      );
    },
    async subscriptions(
      query: paths["/api/subscriptions"]["get"]["parameters"]["query"] = {},
    ) {
      return result(
        await client.GET("/api/subscriptions", { params: { query } }),
      );
    },
    async activeSubscriptions() {
      const items: components["schemas"]["UserSubscription"][] = [];
      let page = 1;
      while (true) {
        const r = result(
          await client.GET("/api/subscriptions", {
            params: { query: { status: "ACTIVE", page, pageSize: 100 } },
          }),
        );
        items.push(...r.items);
        if (page >= r.meta.totalPages) return items;
        page++;
      }
    },
    purchaseSubscription(
      body: components["schemas"]["SubscriptionPurchase"],
      key: string,
    ) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/subscriptions", {
            headers,
            params: { header: { "Idempotency-Key": key } },
            body,
          }),
        ),
      );
    },
    payBooking(
      id: string,
      body: components["schemas"]["CardInput"],
      key: string,
    ) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/bookings/{id}/payments", {
            headers,
            params: { path: { id }, header: { "Idempotency-Key": key } },
            body,
          }),
        ),
      );
    },
    async recommendations() {
      return result(
        await client.GET("/api/me/recommendations", {
          params: { query: { pageSize: 4 } },
        }),
      );
    },
    async bookings(
      query: paths["/api/bookings"]["get"]["parameters"]["query"] = {},
    ) {
      const r = result(
        await client.GET("/api/bookings", { params: { query } }),
      );
      return { ...r, items: r.items as Booking[] };
    },
    async organizerBookings(
      query: paths["/api/organizer/bookings"]["get"]["parameters"]["query"] = {},
    ) {
      const r = result(
        await client.GET("/api/organizer/bookings", { params: { query } }),
      );
      return { ...r, items: r.items as OrganizerBooking[] };
    },
    async booking(id: string) {
      return result(
        await client.GET("/api/bookings/{id}", { params: { path: { id } } }),
      ) as Booking;
    },
    async organizerBooking(id: string) {
      return result(
        await client.GET("/api/organizer/bookings/{id}", {
          params: { path: { id } },
        }),
      ) as OrganizerBooking;
    },
    createBooking(
      body: components["schemas"]["BookingCreate"],
      key = crypto.randomUUID(),
    ) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/bookings", {
            headers,
            params: { header: { "Idempotency-Key": key } },
            body,
          }),
        ),
      );
    },
    cancelBooking(
      id: string,
      reason: string,
      owned = false,
      key = crypto.randomUUID(),
    ) {
      return mutate(async (headers) =>
        owned
          ? result(
              await client.POST("/api/organizer/bookings/{id}/cancel", {
                headers,
                params: { path: { id }, header: { "Idempotency-Key": key } },
                body: { reason },
              }),
            )
          : result(
              await client.POST("/api/bookings/{id}/cancel", {
                headers,
                params: { path: { id }, header: { "Idempotency-Key": key } },
                body: { reason },
              }),
            ),
      );
    },
    decideBooking(
      id: string,
      decision: "APPROVE" | "REJECT",
      reason?: string,
      key = crypto.randomUUID(),
    ) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/organizer/bookings/{id}/decision", {
            headers,
            params: { path: { id }, header: { "Idempotency-Key": key } },
            body: { decision, reason },
          }),
        ),
      );
    },
    async events(
      query: paths["/api/events"]["get"]["parameters"]["query"] = {},
      owned = false,
    ) {
      return owned
        ? result(
            await client.GET("/api/organizer/events", { params: { query } }),
          )
        : result(await client.GET("/api/events", { params: { query } }));
    },
    async event(id: string, owned = false) {
      return owned
        ? result(
            await client.GET("/api/organizer/events/{id}", {
              params: { path: { id } },
            }),
          )
        : result(
            await client.GET("/api/events/{id}", { params: { path: { id } } }),
          );
    },
    async organizers(
      query: paths["/api/organizers"]["get"]["parameters"]["query"] = {},
    ) {
      return result(await client.GET("/api/organizers", { params: { query } }));
    },
    async organizer(id: string) {
      return result(
        await client.GET("/api/organizers/{id}", { params: { path: { id } } }),
      );
    },
    async eventSessions(
      id: string,
      query: paths["/api/events/{id}/sessions"]["get"]["parameters"]["query"] = {},
    ) {
      return result(
        await client.GET("/api/events/{id}/sessions", {
          params: { path: { id }, query },
        }),
      );
    },
    async ownSessions(
      query: paths["/api/organizer/sessions"]["get"]["parameters"]["query"] = {},
    ) {
      return result(
        await client.GET("/api/organizer/sessions", { params: { query } }),
      );
    },
    createEvent(
      body: components["schemas"]["EventCreate"],
      key = crypto.randomUUID(),
    ) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/organizer/events", {
            headers,
            params: { header: { "Idempotency-Key": key } },
            body,
          }),
        ),
      );
    },
    updateEvent(id: string, body: components["schemas"]["EventPatch"]) {
      return mutate(async (headers) =>
        result(
          await client.PATCH("/api/organizer/events/{id}", {
            headers,
            params: { path: { id } },
            body,
          }),
        ),
      );
    },
    eventStatus(id: string, status: "ACTIVE" | "PAUSED") {
      return mutate(async (headers) =>
        result(
          await client.PATCH("/api/organizer/events/{id}/status", {
            headers,
            params: { path: { id } },
            body: { status },
          }),
        ),
      );
    },
    cancelEvent(
      id: string,
      reason: string,
      remove = false,
      key = crypto.randomUUID(),
    ) {
      return mutate(async (headers) =>
        remove
          ? result(
              await client.DELETE("/api/organizer/events/{id}", {
                headers,
                params: { path: { id }, header: { "Idempotency-Key": key } },
                body: { reason },
              }),
            )
          : result(
              await client.POST("/api/organizer/events/{id}/cancel", {
                headers,
                params: { path: { id }, header: { "Idempotency-Key": key } },
                body: { reason },
              }),
            ),
      );
    },
    createSession(
      id: string,
      body: components["schemas"]["SessionWrite"],
      key = crypto.randomUUID(),
    ) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/organizer/events/{id}/sessions", {
            headers,
            params: { path: { id }, header: { "Idempotency-Key": key } },
            body,
          }),
        ),
      );
    },
    updateSession(id: string, body: components["schemas"]["SessionWrite"]) {
      return mutate(async (headers) =>
        result(
          await client.PATCH("/api/organizer/sessions/{id}", {
            headers,
            params: { path: { id } },
            body,
          }),
        ),
      );
    },
    cancelSession(
      id: string,
      reason: string,
      remove = false,
      key = crypto.randomUUID(),
    ) {
      return mutate(async (headers) =>
        remove
          ? result(
              await client.DELETE("/api/organizer/sessions/{id}", {
                headers,
                params: { path: { id } },
              }),
            )
          : result(
              await client.POST("/api/organizer/sessions/{id}/cancel", {
                headers,
                params: { path: { id }, header: { "Idempotency-Key": key } },
                body: { reason },
              }),
            ),
      );
    },
    uploadEventPhoto(id: string, file: File) {
      return mutate(async (headers) => {
        if (file.size > 5 * 1024 * 1024)
          throw Error("Choose an image up to 5 MiB");
        const body = new FormData();
        body.set("file", file);
        const response = await fetch(
          baseUrl + `/api/organizer/events/${id}/photos`,
          {
            method: "POST",
            credentials: "include",
            headers,
            body,
            signal: AbortSignal.timeout(15000),
          },
        );
        const data = await response.json().catch(() => undefined);
        return result<components["schemas"]["Photo"]>({
          response,
          ...(response.ok ? { data } : { error: data }),
        });
      });
    },
    orderPhotos(id: string, photoIds: string[]) {
      return mutate(async (headers) =>
        result(
          await client.PUT("/api/organizer/events/{id}/photos/order", {
            headers,
            params: { path: { id } },
            body: { photoIds },
          }),
        ),
      );
    },
    deletePhoto(id: string) {
      return mutate(async (headers) =>
        result(
          await client.DELETE("/api/organizer/photos/{id}", {
            headers,
            params: { path: { id } },
          }),
        ),
      );
    },
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
        if (
          !file.size ||
          file.size > 5 * 1024 * 1024 ||
          !["image/jpeg", "image/png", "image/webp"].includes(file.type)
        )
          throw new ApiError(
            422,
            "VALIDATION_FAILED",
            "Choose a JPEG, PNG or WebP image up to 5 MiB",
            undefined,
            { file: ["Choose a JPEG, PNG or WebP image up to 5 MiB"] },
          );
        const body = new FormData();
        body.set("file", file);
        const response = await fetch(baseUrl + "/api/me/photo", {
          method: "POST",
          credentials: "include",
          headers,
          body,
          signal: AbortSignal.timeout(15000),
        });
        const data = await response.json().catch(() => undefined);
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
    async notifications(page = 1, unreadOnly = false) {
      return result(
        await client.GET("/api/notifications", {
          params: {
            query: { page, pageSize: 20, ...(unreadOnly ? { unreadOnly } : {}) },
          },
        }),
      );
    },
    async unreadNotifications() {
      return result(
        await client.GET("/api/notifications", {
          params: { query: { page: 1, pageSize: 1, unreadOnly: true } },
        }),
      ).meta.totalItems;
    },
    async conversations(page = 1) {
      return result(
        await client.GET("/api/conversations", {
          params: { query: { page, pageSize: 20 } },
        }),
      );
    },
    startConversation(body: components["schemas"]["ConversationCreate"]) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/conversations", {
            headers,
            params: { header: { "Idempotency-Key": crypto.randomUUID() } },
            body,
          }),
        ),
      );
    },
    async messages(
      id: string,
      query: {
        afterId?: string;
        sort?: "oldest" | "newest";
        pageSize?: number;
        page?: number;
      } = {},
    ) {
      return result(
        await client.GET("/api/conversations/{id}/messages", {
          params: { path: { id }, query: { pageSize: 50, ...query } },
        }),
      );
    },
    sendMessage(id: string, body: components["schemas"]["MessageCreate"], key: string) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/conversations/{id}/messages", {
            headers,
            params: { path: { id }, header: { "Idempotency-Key": key } },
            body,
          }),
        ),
      );
    },
    readConversation(id: string, throughMessageId: string) {
      return mutate(async (headers) =>
        result(
          await client.POST("/api/conversations/{id}/read", {
            headers,
            params: { path: { id } },
            body: { throughMessageId },
          }),
        ),
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
