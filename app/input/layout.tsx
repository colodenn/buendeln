
import "@/styles/globals.css"



interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
            <h1 className="mt-12 text-center text-6xl font-bold text-gray-800">Input</h1>
            <div className="h-full  p-8 w-[900px] mx-auto">{children}</div>
        </>
    )
}
