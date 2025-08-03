import { UsersService } from "~/apis/handlers/users";

export async function sendSubscriptionToBackend(subscription: PushSubscription) {
	const usersService = new UsersService();
	return usersService.savePushSubscription(subscription);
}

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

export async function subscribeUserToPush(): Promise<PushSubscription | null> {
	if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
		alert("Push notifications are not supported in your browser.");
		return null;
	}

	const permission = await Notification.requestPermission();
	if (permission !== "granted") {
		alert("Notification permission denied.");
		return null;
	}

	const registration = await navigator.serviceWorker.ready;
	let subscription = await registration.pushManager.getSubscription();

	if (!subscription) {
		subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
		});
	}

	return subscription;
}

export async function unsubscribeUserFromPush(): Promise<boolean> {
	const registration = await navigator.serviceWorker.ready;
	const subscription = await registration.pushManager.getSubscription();
	if (subscription) {
		await subscription.unsubscribe();
		await removeSubscriptionFromBackend(subscription);
		return true;
	}
	return false;
}

export async function removeSubscriptionFromBackend(subscription: PushSubscription) {
	const usersService = new UsersService();
	return usersService.removePushSubscription(subscription);
}

export async function isUserSubscribedToPush(): Promise<boolean> {
	if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
		return false;
	}
	const registration = await navigator.serviceWorker.ready;
	const subscription = await registration.pushManager.getSubscription();
	return !!subscription;
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
