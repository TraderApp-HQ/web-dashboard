import { GetServerSideProps } from 'next';
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
// import { useRouter } from "next/router";
// import { useEffect } from "react";

// export default function Account() {
//   const router = useRouter();
//   useEffect(() => {
//     router.push(`${LAYOUT_ROUTES.account}${ROUTES.dashboard.homepage}`);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return <div />;
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: `${LAYOUT_ROUTES.account}${ROUTES.dashboard.homepage}`,
      permanent: false,
    },
  };
};

const AccountHome = () => {
  return null;
};

export default AccountHome;

