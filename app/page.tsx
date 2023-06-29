import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function IndexPage() {
  return (
    <Link href={"/input"} className="container flex h-screen cursor-pointer items-center justify-center pb-8 pt-6 md:py-10">
      <h1 className="animate-bounce text-center font-bold text-gray-500 lg:text-8xl 2xl:text-9xl">Buendeln</h1>
    </Link>
  )
}
