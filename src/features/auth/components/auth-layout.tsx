import Image from "next/image"
import Link from "next/link"

const AuthLayout = ({children} : {children : React.ReactNode}) => {
    return (
        <div className="bg-muted flex min-h-svh flex-col gap-6 p-6 md:p-10 justify-center items-center">
            <div className="flex flex-col gap-6 w-full max-w-sm">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                    <Image src="/images/logo.svg" alt="Taskflow" width={30} height={30} />
                    <span className="text-xl">Taskflow</span>
                </Link>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout