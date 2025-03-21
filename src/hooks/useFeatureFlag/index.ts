import { useEffect, useState } from "react";
import { SplitFactory } from "@splitsoftware/splitio";
import { FEATURE_FLAG_CONFIG, FeatureFlag, TrafficType } from "./config";

// Hook to check if a feature flag is enabled for a user
const useFeatureFlag = ({ userId, flagName }: { userId: string; flagName: FeatureFlag }) => {
	const [isEnabled, setIsEnabled] = useState<boolean>(false);

	useEffect(() => {
		// Get the SDK key from the environment
		const SDK_KEY = (process.env.NEXT_PUBLIC_SPLIT_IO_CLIENT_KEY ?? "") as string;
		if (!SDK_KEY) {
			throw new Error("Feature flag configuration key is missing/not set.");
		}

		// Factory instance
		const factory: SplitIO.IBrowserSDK = SplitFactory({
			core: {
				authorizationKey: SDK_KEY,
				key: userId ?? "key",
			},
			startup: { readyTimeout: 30 },
		});

		// Client instance
		const client: SplitIO.IBrowserClient = factory.client();

		const featureFlagConfig = FEATURE_FLAG_CONFIG[flagName];
		if (!featureFlagConfig) {
			console.error(`Feature configuration not found for ${flagName}.`);
			return;
		}

		const checkFlag = async () => {
			try {
				if (featureFlagConfig.level === TrafficType.USER) {
					await client.ready().catch((e) => console.error(e));
					const treatment: SplitIO.Treatment = client.getTreatment(flagName);
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
