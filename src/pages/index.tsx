import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/auth/login',
      permanent: false,
    },
  };
};

const Home = () => {
  return null;
};

export default Home;
