import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-48 flex items-center">
            <Image src="/assets/images/logo1.svg" width={40} height={35} alt="Logo"/>
            <h3 className="font-semibold text-xl ml-2">Tech Events</h3>
        </Link>

        <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems/>
        </nav>

        <div className="flex w-32 justify-end gap-3">
            <MobileNav/>
            <Button className="rounded-full hidden md:inline-grid " size="lg" asChild>
                <Link href="/sign-in">
                    Login
                </Link>
            </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
