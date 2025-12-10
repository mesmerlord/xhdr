import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/tools/twitter-hdr",
      permanent: false,
    },
  };
};

export default function HomePage() {
  return null;
}
