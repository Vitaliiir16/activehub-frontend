// ActiveHub API types generated from the pinned backend contract.
export interface paths {
    "/api/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/csrf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCsrf"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/register/user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["registerUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/register/organizer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["registerOrganizer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSession"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/password-recovery": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["recoverPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/password-reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["resetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/cities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/directions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listDirections"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getProfile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updateProfile"];
        trace?: never;
    };
    "/api/me/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["changePassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/me/photo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["uploadProfilePhoto"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getEvent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/events/{id}/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listEventSessions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listOrganizers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizers/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getOrganizer"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizers/{id}/plans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listOrganizerPublicPlans"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/me/recommendations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listRecommendations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getOrganizerDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listOwnSessions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listOwnEvents"];
        put?: never;
        post: operations["createEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getOwnEvent"];
        put?: never;
        post?: never;
        delete: operations["deleteOwnEvent"];
        options?: never;
        head?: never;
        patch: operations["patchOwnEvent"];
        trace?: never;
    };
    "/api/organizer/events/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["setOwnEventStatus"];
        trace?: never;
    };
    "/api/organizer/events/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelOwnEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/events/{id}/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/sessions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["deleteSession"];
        options?: never;
        head?: never;
        patch: operations["updateSession"];
        trace?: never;
    };
    "/api/organizer/sessions/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/events/{id}/generate-sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["generateSessions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/events/{id}/photos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["uploadEventPhoto"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/events/{id}/photos/order": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["orderEventPhotos"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/photos/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["deleteEventPhoto"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listBookings"];
        put?: never;
        post: operations["createBooking"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getBooking"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelBooking"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/bookings/{id}/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["payBooking"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/bookings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listOwnEventBookings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/bookings/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getOwnEventBooking"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/bookings/{id}/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["decideBooking"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/bookings/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelOwnEventBooking"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/subscription-plans/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPlan"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/subscriptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listSubscriptions"];
        put?: never;
        post: operations["purchaseSubscription"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/subscriptions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSubscription"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/subscription-plans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listOwnPlans"];
        put?: never;
        post: operations["createPlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizer/subscription-plans/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updatePlan"];
        trace?: never;
    };
    "/api/organizer/subscription-plans/{id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["archivePlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/me/loyalty": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getLoyalty"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/me/points-transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listPointsTransactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/conversations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listConversations"];
        put?: never;
        post: operations["createConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/conversations/{id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listMessages"];
        put?: never;
        post: operations["sendMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/conversations/{id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["readConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listNotifications"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/notifications/{id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["readNotification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/notifications/read-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["readAllNotifications"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/me/notification-settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getNotificationSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updateNotificationSettings"];
        trace?: never;
    };
    "/api/admin/statistics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getStatistics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/organizers/{id}/statistics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminGetOrganizerStatistics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminListusers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminGetusers"];
        put?: never;
        post?: never;
        delete: operations["adminDeleteusers"];
        options?: never;
        head?: never;
        patch: operations["adminEditusers"];
        trace?: never;
    };
    "/api/admin/users/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["adminStatususers"];
        trace?: never;
    };
    "/api/admin/organizers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminListorganizers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/organizers/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminGetorganizers"];
        put?: never;
        post?: never;
        delete: operations["adminDeleteorganizers"];
        options?: never;
        head?: never;
        patch: operations["adminEditorganizers"];
        trace?: never;
    };
    "/api/admin/organizers/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["adminStatusorganizers"];
        trace?: never;
    };
    "/api/admin/users/{id}/card": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["adminAssignCard"];
        trace?: never;
    };
    "/api/admin/users/{id}/points-adjustments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["adminAdjustPoints"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminListEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminGetEvent"];
        put?: never;
        post?: never;
        delete: operations["adminDeleteEvent"];
        options?: never;
        head?: never;
        patch: operations["adminEditEvent"];
        trace?: never;
    };
    "/api/admin/events/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["adminSetEventStatus"];
        trace?: never;
    };
    "/api/admin/events/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["adminCancelEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/events/{id}/photos/order": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["adminOrderPhotos"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/photos/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["adminDeletePhoto"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/bookings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminListBookings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/bookings/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminGetBooking"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/bookings/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["adminCancelBooking"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/subscriptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminListSubscriptions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/subscription-plans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminListPlans"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/subscription-plans/{id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["adminArchivePlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/cities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminListcities"];
        put?: never;
        post: operations["adminCreatecities"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/cities/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["adminEditcities"];
        trace?: never;
    };
    "/api/admin/directions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminListdirections"];
        put?: never;
        post: operations["adminCreatedirections"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/directions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["adminEditdirections"];
        trace?: never;
    };
    "/api/admin/loyalty/levels": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminGetLevels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/loyalty/levels/{level}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["adminSetLevel"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/loyalty/rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["adminGetLoyaltyRules"];
        put: operations["adminSetLoyaltyRules"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/administrators": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listAdministrators"];
        put?: never;
        post: operations["createAdministrator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/administrators/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["setAdministratorStatus"];
        trace?: never;
    };
    "/api/media/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getProfilePhoto"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/event-photos/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getEventPhoto"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/organizers/{id}/logo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getOrganizerLogo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Health: {
            status: "ok";
            service: "activehub-api";
            version: string;
            database: "ready";
        };
        Error: {
            error: {
                code: "BAD_REQUEST" | "UNAUTHENTICATED" | "FORBIDDEN" | "ACCOUNT_BLOCKED" | "NOT_FOUND" | "CONFLICT" | "IDEMPOTENCY_MISMATCH" | "REQUEST_IN_PROGRESS" | "VALIDATION_FAILED" | "RATE_LIMITED" | "SERVICE_UNAVAILABLE" | "INTERNAL_ERROR";
                message: string;
                requestId: string;
                fields?: {
                    [key: string]: string[];
                };
            };
        };
        PageMeta: {
            page: number;
            pageSize: number;
            totalItems: number;
            totalPages: number;
        };
        Dictionary: {
            id: string;
            name: string;
            isActive: boolean;
        };
        DictionaryWrite: {
            name: string;
            isActive: boolean;
        };
        CsrfToken: {
            token: string;
            expiresAt: string;
        };
        Login: {
            email: string;
            password: string;
        };
        Session: {
            accountId: string;
            role: "USER" | "ORGANIZER" | "ADMIN";
            expiresAt: string;
        };
        UserRegistration: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            passwordConfirmation: string;
            phone: string;
            cityId: string;
            gender: "MALE" | "FEMALE" | "UNDISCLOSED";
        };
        OrganizerRegistration: {
            email: string;
            password: string;
            passwordConfirmation: string;
            name: string;
            type: "TRAINER" | "CLUB" | "VENUE" | "ORGANIZER";
            directionIds: string[];
            cityId: string;
            phone: string;
            description?: string;
        };
        UserProfile: {
            id: string;
            createdAt: string;
            updatedAt: string;
            email: string;
            role: "USER";
            firstName: string;
            lastName: string;
            phone: string;
            city: components["schemas"]["Dictionary"];
            gender: "MALE" | "FEMALE" | "UNDISCLOSED";
            photoUrl: string | null;
            preferredDirectionIds: string[];
            loyaltyLevel: "STANDARD" | "PREMIUM" | "CORPORATE";
            cardLockedByAdmin: boolean;
            pointsBalance: number;
            lifetimePoints: number;
        };
        OrganizerProfile: {
            id: string;
            createdAt: string;
            updatedAt: string;
            email: string;
            role: "ORGANIZER";
            name: string;
            type: "TRAINER" | "CLUB" | "VENUE" | "ORGANIZER";
            city: components["schemas"]["Dictionary"];
            directions: components["schemas"]["Dictionary"][];
            description: string;
            phone: string | null;
            logoUrl: string | null;
        };
        AdminProfile: {
            id: string;
            createdAt: string;
            updatedAt: string;
            email: string;
            role: "ADMIN";
            displayName: string;
        };
        Profile: components["schemas"]["UserProfile"] | components["schemas"]["OrganizerProfile"] | components["schemas"]["AdminProfile"];
        ProfilePatch: components["schemas"]["USERProfilePatch"] | components["schemas"]["ORGANIZERProfilePatch"] | components["schemas"]["ADMINProfilePatch"];
        PasswordChange: {
            currentPassword: string;
            newPassword: string;
        };
        OrganizerPublic: {
            id: string;
            createdAt: string;
            updatedAt: string;
            name: string;
            type: "TRAINER" | "CLUB" | "VENUE" | "ORGANIZER";
            city: components["schemas"]["Dictionary"];
            directions: components["schemas"]["Dictionary"][];
            description: string;
            phone: string | null;
            logoUrl: string | null;
        };
        Photo: {
            id: string;
            url: string;
            position: number;
        };
        SessionWrite: {
            startsAt: string;
            endsAt: string;
            seatsTotal: number;
        };
        EventSession: {
            id: string;
            createdAt: string;
            updatedAt: string;
            eventId: string;
            startsAt: string;
            endsAt: string;
            status: "SCHEDULED" | "CANCELLED" | "COMPLETED";
            seatsTotal: number;
            seatsTaken: number;
            seatsAvailable: number;
        };
        Event: {
            id: string;
            createdAt: string;
            updatedAt: string;
            organizer: components["schemas"]["OrganizerPublic"];
            title: string;
            description: string;
            kind: "TRAINING" | "SECTION" | "HALL_RENTAL" | "TEAM_SEARCH" | "EVENT";
            direction: components["schemas"]["Dictionary"];
            city: components["schemas"]["Dictionary"];
            address: string;
            skill: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ANY";
            age: "CHILDREN" | "TEENS" | "ADULTS" | "SENIORS" | "ANY";
            priceMinor: number;
            promoPriceMinor: number | null;
            promoUntil: string | null;
            effectivePriceMinor: number;
            seatsPerSession: number;
            confirmationMode: "AUTO" | "MANUAL";
            photos: components["schemas"]["Photo"][];
            status: "ACTIVE" | "PAUSED" | "CANCELLED" | "BLOCKED" | "DELETED";
            nextSession: components["schemas"]["EventSession"] | null;
            isFull: boolean;
            isCompleted: boolean;
            trainerName?: string;
        };
        EventCreate: {
            title: string;
            description: string;
            kind: "TRAINING" | "SECTION" | "HALL_RENTAL" | "TEAM_SEARCH" | "EVENT";
            directionId: string;
            cityId: string;
            address: string;
            skill: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ANY";
            age: "CHILDREN" | "TEENS" | "ADULTS" | "SENIORS" | "ANY";
            priceMinor: number;
            promoPriceMinor?: number | null;
            promoUntil?: string | null;
            seatsPerSession: number;
            confirmationMode?: "AUTO" | "MANUAL";
            sessions: components["schemas"]["SessionWrite"][];
            trainerName?: string;
        };
        EventPatch: {
            title?: string;
            description?: string;
            directionId?: string;
            cityId?: string;
            address?: string;
            skill?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ANY";
            age?: "CHILDREN" | "TEENS" | "ADULTS" | "SENIORS" | "ANY";
            priceMinor?: number;
            promoPriceMinor?: number | null;
            promoUntil?: string | null;
            seatsPerSession?: number;
            confirmationMode?: "AUTO" | "MANUAL";
            trainerName?: string;
        };
        PhotoOrder: {
            photoIds: string[];
        };
        Reason: {
            reason: string;
        };
        UserCancellation: {
            reason?: string;
        };
        StatusChange: {
            status: "ACTIVE" | "BLOCKED";
            reason: string;
        };
        EventStatusChange: {
            status: "ACTIVE" | "PAUSED" | "BLOCKED";
            reason?: string;
        };
        BookingCreate: {
            sessionId: string;
            seats: number;
            comment?: string;
            paymentMethod: "CARD" | "SUBSCRIPTION";
            subscriptionId?: string;
        };
        Discount: {
            type: "PROMOTION" | "FREE_ACCESS" | "CARD_DISCOUNT" | "POINTS";
            amountMinor: number;
            description: string;
        };
        Booking: {
            id: string;
            createdAt: string;
            updatedAt: string;
            userId: string;
            sessionId: string;
            eventTitle: string;
            organizerId: string;
            startsAt: string;
            endsAt: string;
            seats: number;
            comment: string | null;
            status: "PENDING" | "AWAITING_PAYMENT" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "EXPIRED" | "COMPLETED";
            basePriceMinor: number;
            discountBreakdown: components["schemas"]["Discount"][];
            amountDueMinor: number;
            paymentMethod: "CARD" | "SUBSCRIPTION" | "FREE";
            subscriptionUsedId: string | null;
            pointsRedeemed: 0;
            deadlineAt: string | null;
            cancelledBy: ("USER" | "ORGANIZER" | "ADMIN" | "SYSTEM") | null;
            cancelReason: string | null;
            timeline: components["schemas"]["BookingTransition"][];
            payments: components["schemas"]["Payment"][];
            eventId: string;
            address: string;
            canCancel: boolean;
            canPay: boolean;
            changeRefundEligible: boolean;
        };
        BookingTransition: {
            from: ("PENDING" | "AWAITING_PAYMENT" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "EXPIRED" | "COMPLETED") | null;
            to: "PENDING" | "AWAITING_PAYMENT" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "EXPIRED" | "COMPLETED";
            at: string;
            actor: "USER" | "ORGANIZER" | "ADMIN" | "SYSTEM";
            reason: string | null;
        };
        OrganizerBooking: {
            booking: components["schemas"]["Booking"];
            user: {
                id: string;
                displayName: string;
                email?: string;
                phone?: string;
            };
        };
        BookingDecision: {
            decision: "APPROVE" | "REJECT";
            reason?: string;
        };
        CardInput: {
            number: string;
            holder: string;
            expiryMonth: number;
            expiryYear: number;
            cvv: string;
        };
        Payment: {
            id: string;
            createdAt: string;
            updatedAt: string;
            bookingId: string | null;
            subscriptionId: string | null;
            amountMinor: number;
            currency: "UAH";
            status: "SUCCEEDED" | "FAILED" | "REFUNDED";
            cardLast4: string;
            refundedAt?: string | null;
        };
        PlanWrite: {
            name: string;
            type: "ONE_TIME" | "MONTHLY" | "CORPORATE";
            description: string;
            priceMinor: number;
            validityDays: number;
            visitsLimit: number | null;
            scope: "ALL_EVENTS" | "DIRECTIONS";
            directionIds: string[];
        };
        SubscriptionPlan: {
            id: string;
            createdAt: string;
            updatedAt: string;
            organizerId: string;
            name: string;
            type: "ONE_TIME" | "MONTHLY" | "CORPORATE";
            description: string;
            priceMinor: number;
            validityDays: number;
            visitsLimit: number | null;
            scope: "ALL_EVENTS" | "DIRECTIONS";
            directionIds: string[];
            status: "ACTIVE" | "ARCHIVED";
            directionNames?: string[];
        };
        SubscriptionPurchase: {
            planId: string;
            companyName?: string;
            card: components["schemas"]["CardInput"];
        };
        SubscriptionPurchaseResult: {
            payment: components["schemas"]["Payment"];
            subscription: components["schemas"]["UserSubscription"] | null;
        };
        UserSubscription: {
            id: string;
            createdAt: string;
            updatedAt: string;
            userId: string;
            plan: components["schemas"]["SubscriptionPlan"];
            status: "ACTIVE" | "EXPIRED" | "EXHAUSTED";
            startsAt: string;
            expiresAt: string;
            visitsLeft: number | null;
            companyName: string | null;
        };
        LoyaltyLevel: {
            level: "STANDARD" | "PREMIUM" | "CORPORATE";
            displayName: string;
            pointsThreshold: number | null;
            multiplier: string;
            discountPercent: string;
            freeDirectionIds: string[];
            freeVisitsPerMonth: number;
        };
        LoyaltyRules: {
            basePointsPerBooking: number;
            pointsPerUah: string;
            redeemRateMinor: number;
            maxRedeemPercent: string;
        };
        PointsTransaction: {
            id: string;
            createdAt: string;
            updatedAt: string;
            userId: string;
            bookingId: string | null;
            delta: number;
            reason: "ACCRUAL" | "REDEEM" | "REVERSAL" | "REFUND_RESTORE" | "ADMIN_ADJUST";
        };
        LoyaltySummary: {
            card: components["schemas"]["LoyaltyLevel"];
            cardLockedByAdmin: boolean;
            pointsBalance: number;
            lifetimePoints: number;
            pointsToNextLevel: number | null;
            quotaMonth: string;
            freeVisitsUsed: number;
            freeVisitsRemaining: number;
            bookingCount: number;
            attendanceCount: number;
        };
        CardAssignment: {
            level: "STANDARD" | "PREMIUM" | "CORPORATE";
            locked: boolean;
            reason: string;
        };
        PointsAdjustment: {
            delta: number;
            reason: string;
        };
        Conversation: {
            id: string;
            createdAt: string;
            updatedAt: string;
            userId: string;
            organizerId: string;
            lastMessageAt: string | null;
            unreadCount: number;
        };
        ConversationCreate: {
            organizerId?: string;
            userId?: string;
            eventId?: string;
            bookingId?: string;
        };
        MessageCreate: {
            text: string;
            eventId?: string;
        };
        Message: {
            id: string;
            createdAt: string;
            updatedAt: string;
            conversationId: string;
            senderId: string;
            text: string;
            eventId: string | null;
            readAt: string | null;
        };
        ReadConversation: {
            throughMessageId: string;
        };
        Notification: {
            id: string;
            createdAt: string;
            updatedAt: string;
            type: string;
            category: string;
            title: string;
            body: string;
            link: string;
            readAt: string | null;
            emailStatus: "NONE" | "QUEUED" | "SENT" | "FAILED";
        };
        NotificationSettings: {
            remindersEmail: boolean;
            promotionsEmail: boolean;
            loyaltyEmail: boolean;
            messagesEmail: boolean;
        };
        ReadResult: {
            updatedCount: number;
            unreadCount: number;
        };
        AdminCreate: {
            email: string;
            password: string;
            displayName: string;
        };
        AccountSummary: {
            id: string;
            createdAt: string;
            updatedAt: string;
            email: string;
            role: "USER" | "ORGANIZER" | "ADMIN";
            status: "ACTIVE" | "BLOCKED" | "DELETED";
            displayName: string;
            cityId: string | null;
            lastLoginAt: string | null;
        };
        AdminUserDetail: {
            account: components["schemas"]["AccountSummary"];
            profile: components["schemas"]["UserProfile"];
        };
        AdminOrganizerDetail: {
            account: components["schemas"]["AccountSummary"];
            profile: components["schemas"]["OrganizerProfile"];
        };
        CountBucket: {
            key: string;
            label: string;
            count: number;
        };
        Statistics: {
            dateFrom: string;
            dateTo: string;
            users: number;
            organizers: number;
            activeEvents: number;
            bookings: number;
            netRevenueMinor: number;
            bookingConversion: string;
            bookingsByDay: components["schemas"]["CountBucket"][];
            bookingsByStatus: components["schemas"]["CountBucket"][];
            bookingsByDirection: components["schemas"]["CountBucket"][];
            bookingsByCity: components["schemas"]["CountBucket"][];
            topEvents: components["schemas"]["CountBucket"][];
            eventsByDay: components["schemas"]["CountBucket"][];
            eventsByKind: components["schemas"]["CountBucket"][];
            eventsByDirection: components["schemas"]["CountBucket"][];
            eventsByCity: components["schemas"]["CountBucket"][];
            registrationsByDay: components["schemas"]["CountBucket"][];
            registrationsByRole: components["schemas"]["CountBucket"][];
            usersByCity: components["schemas"]["CountBucket"][];
            usersByGender: components["schemas"]["CountBucket"][];
            usersByCard: components["schemas"]["CountBucket"][];
        };
        OrganizerDashboard: {
            totalEvents: number;
            activeEvents: number;
            pausedEvents: number;
            completedEvents: number;
            futureSessions: number;
            activeFutureBookings: number;
            pendingRequests: number;
            currentMonthNetRevenueMinor: number;
            unreadMessages: number;
            bookingsLast30Days: components["schemas"]["CountBucket"][];
        };
        Recovery: {
            email: string;
        };
        ResetPassword: {
            token: string;
            newPassword: string;
        };
        Accepted: {
            message: string;
        };
        ScheduleGenerate: {
            dateFrom: string;
            dateTo: string;
            weekdays: number[];
            localStartTime: string;
            durationMinutes: number;
            seatsTotal: number;
        };
        DictionaryPage: {
            items: components["schemas"]["Dictionary"][];
            meta: components["schemas"]["PageMeta"];
        };
        OrganizerPublicPage: {
            items: components["schemas"]["OrganizerPublic"][];
            meta: components["schemas"]["PageMeta"];
        };
        EventPage: {
            items: components["schemas"]["Event"][];
            meta: components["schemas"]["PageMeta"];
        };
        EventSessionPage: {
            items: components["schemas"]["EventSession"][];
            meta: components["schemas"]["PageMeta"];
        };
        BookingPage: {
            items: components["schemas"]["Booking"][];
            meta: components["schemas"]["PageMeta"];
        };
        OrganizerBookingPage: {
            items: components["schemas"]["OrganizerBooking"][];
            meta: components["schemas"]["PageMeta"];
        };
        SubscriptionPlanPage: {
            items: components["schemas"]["SubscriptionPlan"][];
            meta: components["schemas"]["PageMeta"];
        };
        UserSubscriptionPage: {
            items: components["schemas"]["UserSubscription"][];
            meta: components["schemas"]["PageMeta"];
        };
        PointsTransactionPage: {
            items: components["schemas"]["PointsTransaction"][];
            meta: components["schemas"]["PageMeta"];
        };
        ConversationPage: {
            items: components["schemas"]["Conversation"][];
            meta: components["schemas"]["PageMeta"];
        };
        MessagePage: {
            items: components["schemas"]["Message"][];
            meta: components["schemas"]["PageMeta"];
        };
        NotificationPage: {
            items: components["schemas"]["Notification"][];
            meta: components["schemas"]["PageMeta"];
        };
        AccountSummaryPage: {
            items: components["schemas"]["AccountSummary"][];
            meta: components["schemas"]["PageMeta"];
        };
        PlanPatch: {
            name?: string;
            type?: "ONE_TIME" | "MONTHLY" | "CORPORATE";
            description?: string;
            priceMinor?: number;
            validityDays?: number;
            visitsLimit?: number | null;
            scope?: "ALL_EVENTS" | "DIRECTIONS";
            directionIds?: string[];
        };
        LoyaltyLevelList: components["schemas"]["LoyaltyLevel"][];
        USERProfilePatch: {
            email?: string;
            firstName?: string;
            lastName?: string;
            phone?: string;
            cityId?: string;
            gender?: "MALE" | "FEMALE" | "UNDISCLOSED";
            photoId?: string | null;
            preferredDirectionIds?: string[];
        };
        ORGANIZERProfilePatch: {
            email?: string;
            name?: string;
            type?: "TRAINER" | "CLUB" | "VENUE" | "ORGANIZER";
            phone?: string | null;
            cityId?: string;
            description?: string;
            logoId?: string | null;
            directionIds?: string[];
        };
        ADMINProfilePatch: {
            email?: string;
            displayName?: string;
        };
    };
    responses: {
        Error503: {
            headers: {
                "X-Request-ID"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        Error400: {
            headers: {
                "X-Request-ID"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        Error401: {
            headers: {
                "X-Request-ID"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        Error403: {
            headers: {
                "X-Request-ID"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        Error404: {
            headers: {
                "X-Request-ID"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        Error409: {
            headers: {
                "X-Request-ID"?: string;
                "Retry-After"?: number;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        Error422: {
            headers: {
                "X-Request-ID"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        Error429: {
            headers: {
                "X-Request-ID"?: string;
                "Retry-After"?: number;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        Error413: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Health"];
                };
            };
            503: components["responses"]["Error503"];
        };
    };
    getCsrf: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CsrfToken"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Login"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Session"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    registerUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserRegistration"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Session"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    registerOrganizer: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OrganizerRegistration"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Session"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getSession: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Session"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    recoverPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Recovery"];
            };
        };
        responses: {
            202: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Accepted"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    resetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetPassword"];
            };
        };
        responses: {
            204: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listCities: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                sort?: "newest" | "oldest";
                includeSelected?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DictionaryPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listDirections: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                sort?: "newest" | "oldest";
                includeSelected?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DictionaryPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Profile"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    updateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProfilePatch"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Profile"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    changePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasswordChange"];
            };
        };
        responses: {
            204: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    uploadProfilePhoto: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    file: string;
                };
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Photo"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listEvents: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                id?: string;
                title?: string;
                organizerId?: string;
                cityId?: string | "all";
                directionId?: string;
                kind?: "TRAINING" | "SECTION" | "HALL_RENTAL" | "TEAM_SEARCH" | "EVENT";
                skill?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ANY";
                age?: "CHILDREN" | "TEENS" | "ADULTS" | "SENIORS" | "ANY";
                dateFrom?: string;
                dateTo?: string;
                minPriceMinor?: number;
                maxPriceMinor?: number;
                availableOnly?: boolean;
                freeOnly?: boolean;
                sort?: "nearest" | "priceAsc" | "priceDesc" | "newest";
                trainerName?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listEventSessions: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                dateFrom?: string;
                dateTo?: string;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventSessionPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listOrganizers: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                name?: string;
                type?: "TRAINER" | "CLUB" | "VENUE" | "ORGANIZER";
                directionId?: string;
                cityId?: string;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizerPublicPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getOrganizer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizerPublic"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listOrganizerPublicPlans: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionPlanPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listRecommendations: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getOrganizerDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizerDashboard"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listOwnSessions: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                eventId?: string;
                dateFrom?: string;
                dateTo?: string;
                status?: "SCHEDULED" | "CANCELLED" | "COMPLETED";
                sort?: "startsAtAsc" | "startsAtDesc";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventSessionPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listOwnEvents: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                id?: string;
                title?: string;
                organizerId?: string;
                cityId?: string | "all";
                directionId?: string;
                kind?: "TRAINING" | "SECTION" | "HALL_RENTAL" | "TEAM_SEARCH" | "EVENT";
                skill?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ANY";
                age?: "CHILDREN" | "TEENS" | "ADULTS" | "SENIORS" | "ANY";
                dateFrom?: string;
                dateTo?: string;
                minPriceMinor?: number;
                maxPriceMinor?: number;
                availableOnly?: boolean;
                freeOnly?: boolean;
                sort?: "nearest" | "priceAsc" | "priceDesc" | "newest";
                status?: "ACTIVE" | "PAUSED" | "CANCELLED" | "BLOCKED" | "DELETED";
                trainerName?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    createEvent: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventCreate"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getOwnEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    deleteOwnEvent: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Reason"];
            };
        };
        responses: {
            204: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    patchOwnEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventPatch"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    setOwnEventStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventStatusChange"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    cancelOwnEvent: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Reason"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    createSession: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SessionWrite"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventSession"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    deleteSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    updateSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SessionWrite"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventSession"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    cancelSession: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Reason"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventSession"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    generateSessions: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ScheduleGenerate"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventSessionPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    uploadEventPhoto: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    file: string;
                };
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Photo"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    orderEventPhotos: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PhotoOrder"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    deleteEventPhoto: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listBookings: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                id?: string;
                status?: "PENDING" | "AWAITING_PAYMENT" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "EXPIRED" | "COMPLETED";
                dateFrom?: string;
                dateTo?: string;
                eventName?: string;
                eventId?: string;
                sort?: "startsAtAsc" | "startsAtDesc" | "newest";
                tab?: "upcoming" | "past" | "cancelled";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    createBooking: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BookingCreate"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Booking"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getBooking: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Booking"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    cancelBooking: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserCancellation"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Booking"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    payBooking: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CardInput"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Payment"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listOwnEventBookings: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                id?: string;
                status?: "PENDING" | "AWAITING_PAYMENT" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "EXPIRED" | "COMPLETED";
                dateFrom?: string;
                dateTo?: string;
                eventName?: string;
                eventId?: string;
                sort?: "startsAtAsc" | "startsAtDesc" | "newest";
                userName?: string;
                tab?: "upcoming" | "past" | "cancelled";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizerBookingPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getOwnEventBooking: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizerBooking"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    decideBooking: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BookingDecision"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Booking"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    cancelOwnEventBooking: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Reason"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Booking"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionPlan"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listSubscriptions: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                status?: "ACTIVE" | "EXPIRED" | "EXHAUSTED";
                type?: "ONE_TIME" | "MONTHLY" | "CORPORATE";
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserSubscriptionPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    purchaseSubscription: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubscriptionPurchase"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionPurchaseResult"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getSubscription: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserSubscription"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listOwnPlans: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionPlanPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    createPlan: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PlanWrite"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionPlan"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    updatePlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PlanPatch"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionPlan"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    archivePlan: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionPlan"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getLoyalty: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltySummary"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listPointsTransactions: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                dateFrom?: string;
                dateTo?: string;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PointsTransactionPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listConversations: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                sort?: "lastMessageDesc" | "lastMessageAsc";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConversationPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    createConversation: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConversationCreate"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Conversation"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listMessages: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                afterId?: string;
                sort?: "oldest" | "newest";
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessagePage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    sendMessage: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MessageCreate"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Message"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    readConversation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReadConversation"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReadResult"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listNotifications: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                unreadOnly?: boolean;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    readNotification: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReadResult"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    readAllNotifications: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReadResult"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getNotificationSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationSettings"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    updateNotificationSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NotificationSettings"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationSettings"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getStatistics: {
        parameters: {
            query?: {
                dateFrom?: string;
                dateTo?: string;
                period?: "7d" | "30d" | "90d" | "custom";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Statistics"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminGetOrganizerStatistics: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizerDashboard"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminListusers: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                id?: string;
                search?: string;
                cityId?: string;
                status?: "ACTIVE" | "BLOCKED" | "DELETED";
                registeredFrom?: string;
                registeredTo?: string;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountSummaryPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminGetusers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserDetail"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminDeleteusers: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Reason"];
            };
        };
        responses: {
            204: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminEditusers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProfilePatch"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserDetail"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminStatususers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StatusChange"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserDetail"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminListorganizers: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                id?: string;
                name?: string;
                type?: "TRAINER" | "CLUB" | "VENUE" | "ORGANIZER";
                cityId?: string;
                directionId?: string;
                status?: "ACTIVE" | "BLOCKED" | "DELETED";
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountSummaryPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminGetorganizers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminOrganizerDetail"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminDeleteorganizers: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Reason"];
            };
        };
        responses: {
            204: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminEditorganizers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProfilePatch"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminOrganizerDetail"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminStatusorganizers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StatusChange"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminOrganizerDetail"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminAssignCard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CardAssignment"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserProfile"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminAdjustPoints: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PointsAdjustment"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PointsTransaction"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminListEvents: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                id?: string;
                title?: string;
                organizerId?: string;
                cityId?: string | "all";
                directionId?: string;
                kind?: "TRAINING" | "SECTION" | "HALL_RENTAL" | "TEAM_SEARCH" | "EVENT";
                skill?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ANY";
                age?: "CHILDREN" | "TEENS" | "ADULTS" | "SENIORS" | "ANY";
                dateFrom?: string;
                dateTo?: string;
                minPriceMinor?: number;
                maxPriceMinor?: number;
                availableOnly?: boolean;
                freeOnly?: boolean;
                sort?: "nearest" | "priceAsc" | "priceDesc" | "newest";
                status?: "ACTIVE" | "PAUSED" | "CANCELLED" | "BLOCKED" | "DELETED";
                trainerName?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminGetEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminDeleteEvent: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Reason"];
            };
        };
        responses: {
            204: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminEditEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventPatch"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminSetEventStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventStatusChange"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminCancelEvent: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Reason"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminOrderPhotos: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PhotoOrder"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminDeletePhoto: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminListBookings: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                id?: string;
                status?: "PENDING" | "AWAITING_PAYMENT" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "EXPIRED" | "COMPLETED";
                dateFrom?: string;
                dateTo?: string;
                eventName?: string;
                eventId?: string;
                sort?: "startsAtAsc" | "startsAtDesc" | "newest";
                userId?: string;
                organizerId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookingPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminGetBooking: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Booking"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminCancelBooking: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Reason"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Booking"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminListSubscriptions: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                userId?: string;
                organizerId?: string;
                status?: "ACTIVE" | "EXPIRED" | "EXHAUSTED";
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserSubscriptionPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminListPlans: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                organizerId?: string;
                status?: "ACTIVE" | "ARCHIVED";
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionPlanPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminArchivePlan: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionPlan"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminListcities: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                isActive?: boolean;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DictionaryPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminCreatecities: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DictionaryWrite"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dictionary"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminEditcities: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DictionaryWrite"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dictionary"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminListdirections: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                isActive?: boolean;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DictionaryPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminCreatedirections: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DictionaryWrite"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dictionary"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminEditdirections: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DictionaryWrite"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dictionary"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminGetLevels: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyLevelList"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminSetLevel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                level: "STANDARD" | "PREMIUM" | "CORPORATE";
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoyaltyLevel"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyLevel"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminGetLoyaltyRules: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyRules"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    adminSetLoyaltyRules: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoyaltyRules"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoyaltyRules"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    listAdministrators: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                sort?: "newest" | "oldest";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountSummaryPage"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    createAdministrator: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminCreate"];
            };
        };
        responses: {
            201: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminProfile"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    setAdministratorStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StatusChange"];
            };
        };
        responses: {
            200: {
                headers: {
                    "X-Request-ID"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountSummary"];
                };
            };
            400: components["responses"]["Error400"];
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
            409: components["responses"]["Error409"];
            413: components["responses"]["Error413"];
            422: components["responses"]["Error422"];
            429: components["responses"]["Error429"];
            503: components["responses"]["Error503"];
        };
    };
    getProfilePhoto: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "image/webp": string;
                };
            };
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
        };
    };
    getEventPhoto: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "image/webp": string;
                };
            };
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
        };
    };
    getOrganizerLogo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "image/webp": string;
                };
            };
            401: components["responses"]["Error401"];
            403: components["responses"]["Error403"];
            404: components["responses"]["Error404"];
        };
    };
}
