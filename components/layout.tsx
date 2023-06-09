import Head from "next/head";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <title>Filmingo</title>
        <meta
          name="description"
          content="Discover a captivating movie-watching experience with Filmingo. Watch and enjoy films together with friends in real-time, creating lasting memories. Explore a vast library of films, sync up with loved ones, and immerse yourself in the world of cinematic entertainment like never before."
        />
        <link rel="icon" href="https://res.cloudinary.com/davkfrmah/image/upload/c_scale,h_48/v1684239381/Filmingo/flamingo_logo.png"></link>
      </Head>
      <div>
        <div className="min-h-screen">
          <main>{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
