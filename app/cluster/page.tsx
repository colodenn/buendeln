import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function ClusterPage() {
    return (
        <>

            <div className="flex justify-around items-center w-full h-screen p-12 space-x-12">

                <div className="bg-white rounded-lg shadow-lg w-6/12 h-full"></div>
                <div className="bg-white rounded-lg shadow-lg w-6/12 h-full"></div>
            </div>
        </>
    )
}
