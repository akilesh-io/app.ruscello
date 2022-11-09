// import { Footer } from './Footer';
// import { Navbar } from './Navbar';
import Meta from './meta'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div>
        <Meta />
        <div className="min-h-screen">
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}

export default Layout
