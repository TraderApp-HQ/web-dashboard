/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
	subscribeUserToPush,
	sendSubscriptionToBackend,
	unsubscribeUserFromPush,
	isUserSubscribedToPush,
} from "~/utils/pushNotifications";

export default function EnablePushNotificationsButton() {
	const [loading, setLoading] = useState(false);
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		(async () => {
			const subscribed = await isUserSubscribedToPush();
			setEnabled(subscribed);
		})();
	}, []);

	const handleEnable = async () => {
		setLoading(true);
		let subscription: PushSubscription | null = null;
		try {
			subscription = await subscribeUserToPush();
			if (subscription) {
				await sendSubscriptionToBackend(subscription);
				setEnabled(true);
				alert("Push notifications enabled!");
			} else {
				alert("Failed to subscribe for push notifications.");
			}
		} catch (e: any) {
			console.error(e);
			// If we created a subscription but failed to send to backend, unsubscribe from browser
			if (subscription) {
				try {
					await subscription.unsubscribe();
				} catch (unsubErr) {
					console.error("Failed to clean up browser subscription:", unsubErr);
				}
			}
			alert(
				e?.message
					? `Failed to enable push notifications: ${e.message}`
					: "Failed to enable push notifications.",
			);
			setEnabled(false);
		}
		setLoading(false);
	};

	const handleDisable = async () => {
		setLoading(true);
		try {
			await unsubscribeUserFromPush();
			setEnabled(false);
			alert("Push notifications disabled!");
		} catch (e) {
			alert("Failed to disable push notifications.");
		}
		setLoading(false);
	};

	return enabled ? (
		<button onClick={handleDisable} disabled={loading}>
			{loading ? "Disabling..." : "Disable Push Notifications"}
		</button>
	) : (
		<button onClick={handleEnable} disabled={loading}>
			{loading ? "Enabling..." : "Enable Push Notifications"}
		</button>
	);
}
