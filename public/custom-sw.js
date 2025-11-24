self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

// This line is required for next-pwa to inject the precache manifest
self.__WB_MANIFEST;

// Your push notification handlers
self.addEventListener("push", function (event) {
	const data = event.data ? event.data.json() : {};
	const title = data.title || "TraderApp Notification";
	const options = {
		body: data.body,
		icon: "/icons/icon-192x192.png",
		badge: "/icons/icon-192x192.png",
		data: data.url ? { url: data.url } : {},
	};
	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
	event.notification.close();
	if (event.notification.data && event.notification.data.url) {
		event.waitUntil(clients.openWindow(event.notification.data.url));
	}
});
