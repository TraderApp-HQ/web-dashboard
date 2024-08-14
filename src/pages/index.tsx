// import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
	useEffect(() => {
		router.push("/auth/login");
	}, []);
};

export default Home;
