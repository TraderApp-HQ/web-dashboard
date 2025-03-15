import { useEffect, useState } from "react";
import { SplitFactory } from "@splitsoftware/splitio";
import { FEATURE_FLAG_CONFIG, FeatureFlag, TrafficType } from "./config";
import SplitIO from "@splitsoftware/splitio-commons/types/splitio";

const SDK_KEY = (process.env.NEXT_PUBLIC_SPLIT_IO_CLIENT_KEY ?? "my-feature-flag-key") as string; // Use an environment variable

if (!SDK_KEY) {
	throw new Error("Feature flag configuration key is missing/not set.");
}

// Factory instance
const factory: SplitIO.ISDK = SplitFactory({
	core: { authorizationKey: SDK_KEY },
	startup: { readyTimeout: 30 },
});

// Client instance
const client: SplitIO.IClient = factory.client();

// Hook to check if a feature flag is enabled for a user
const useFeatureFlag = ({ userId, flagName }: { userId: string; flagName: FeatureFlag }) => {
	const [isEnabled, setIsEnabled] = useState<boolean>(false);

	useEffect(() => {
		const featureFlagConfig = FEATURE_FLAG_CONFIG[flagName];
		if (!featureFlagConfig) {
			console.error(`Feature configuration not found for ${flagName}.`);
			return;
		}

		const checkFlag = async () => {
			try {
				if (featureFlagConfig.level === TrafficType.USER) {
					await client.ready();
					const treatment: SplitIO.Treatment = client.getTreatment(userId, flagName);
					setIsEnabled(treatment === "on");
				} else {
					throw new Error("Feature configuration incorrect.");
				}
			} catch (error) {
				console.error("Error checking feature flag:", error);
			}
		};

		checkFlag();

		return () => {
			client.destroy();
		};
	}, [flagName, userId]);

	return isEnabled;
};

export default useFeatureFlag;
