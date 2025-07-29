// import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingLogo from "~/components/common/LoadingLogo";
import { usePWAMobileDetection } from "~/hooks/usePWAMobileDetection";

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	return {
// 		redirect: {
// 			destination: "/auth/login",
// 			permanent: false,
// 		},
// 	};
// };

const Home = () => {
	const router = useRouter();
	const { isMobileAndPWA, isLoading } = usePWAMobileDetection();
	useEffect(() => {
		if (!isLoading) {
			if (isMobileAndPWA) {
				router.push("/onboarding");
			} else {
				router.push("/auth/login");
			}
		}
	}, [isLoading, isMobileAndPWA]);

	if (isLoading) {
		return <LoadingLogo />;
	}
	return null;
};

export default Home;
