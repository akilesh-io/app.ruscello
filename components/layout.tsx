type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <div>
        <div className="min-h-screen">
          <main>{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
