import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";


const Navbar = async () => {
    /* these two lines run on the server side, not client. Thus await/async(?) */
    const {getUser} = getKindeServerSession() /* this gets the getUser function from the getKindeServerSession thing imported */
    const user = await getUser()
    const isAdmin = user?.email === process.env.ADMIN_EMAIL /* set as my email in the .env file */

    return (
        <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href="/" className="flex z-40 font-semibold">
                        case<span className="text-green-600">cobra</span>
                    </Link>

                    <div className="h-full flex items-center space-x-4">
                        {user ? ( 
                            <> {/* <> stuff is a React fragment, not a DOM element */}
                                {/* User is logged in, show logout link */}
                                <Link href='/api/auth/logout'
                                className={buttonVariants({
                                    size: 'sm',
                                    variant: 'ghost',
                                })}>
                                    Sign out
                                </Link>
                                {isAdmin ? <Link /* is Admin ? used to allow secret admin dashboard/stuff */
                                    href='/api/auth/logout'
                                    className={buttonVariants({
                                        size: 'sm',
                                        variant: 'ghost',
                                })}>
                                    Dashboard ✨
                                </Link> : null}
                                <Link 
                                    href='/configure/upload'
                                    className={buttonVariants({
                                        size: 'sm',
                                        className: 'hidden sm:flex items-center gap-1' /* : used instead of = because it's an object */
                                })}>
                                    Create case
                                    <ArrowRight className='ml-1.5 h-5 w-5'/>
                                </Link>
                            </>
                        ) : (
                            <>
                            <Link href='/api/auth/register'
                            className={buttonVariants({
                                size: 'sm',
                                variant: 'ghost',
                            })}>
                                Sign up
                            </Link>
                            
                            <Link /* if no user */
                                href='/api/auth/login'
                                className={buttonVariants({
                                    size: 'sm',
                                    variant: 'ghost',
                                })}>
                                Login
                                <ArrowRight className='ml-1.5 h-5 w-5'/>
                            </Link>

                            <div className='h-8 w-px bg-zinc-200 hidden sm:block'/>

                            <Link 
                                    href='/configure/upload'
                                    className={buttonVariants({
                                        size: 'sm',
                                        className: 'hidden sm:flex items-center gap-1' /* : used instead of = because it's an object */
                                })}>
                                    Create case
                                    <ArrowRight className='ml-1.5 h-5 w-5'/>
                                </Link>
                        </>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    );
}

export default Navbar;
