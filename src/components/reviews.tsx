"use client" /* we need to mark this whole thing as a client-side componenet, since the below (useRef and MaxWidthWrapper) are server-side components */

import { HTMLAttributes, useEffect, useRef, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";

const PHONES = [
    "/testimonials/1.jpg",
    "/testimonials/2.jpg",
    "/testimonials/3.jpg",
    "/testimonials/4.jpg",
    "/testimonials/5.jpg",
    "/testimonials/6.jpg",
]

function splitArray<T>(array: Array<T>, numParts: number) {
    const result: Array<Array<T>> = [] /* <T> is a typescript "generic". Basically being passed in so that whatever input should be seen as an array.....???
    For example if a string is entered like "5" then it'll still be taken/used as an array of 5 because of how it's placed with type Array here..??*/

    for (let i = 0; i < array.length; i++) {
        const index = i % numParts
        if (!result[index]) {
            result[index] = []
        }
        result[index].push(array[i])
    }
    return result
}

function ReviewColumn(
    {
    reviews,
    className,
    reviewClassName,
    msPerPixel = 0
    } : {
    reviews: string[]
    className?: string
    reviewClassName?: (reviewIndex: number) => string
    msPerPixel?: number
}){
    const columnRef = useRef<HTMLDivElement | null>(null)
    const [columnHeight, setColumnHeight] = useState(0)
    const duration = `${columnHeight * msPerPixel}ms` /* for determining animation speed */

    /* to listen to what size the screen(/this animation component?) is */
    useEffect(()=> {
        if(!columnRef.current) return /* if component not even loaded/here yet(?) then do nothing */
        const resizeObserver = new window.ResizeObserver(() => {/* ResizeObserver is an API. The (() => ) thing is called a callback function */
            setColumnHeight(columnRef.current?.offsetHeight ?? 0) /* the ?? 0 is like else if columnRef.current not defined, then 0 */
        })

        resizeObserver.observe(columnRef.current) /* tells to observe what happens/changes in the ref={columnRef} div element below */

        return () => {
            resizeObserver.disconnect()
        }
    }, []) /* dependency array empty so that this only runs once, at the first render of the component */
        
    return (
    <div
        ref={columnRef}
        className={cn('animate-marquee space-y-8 py-4', className)}
        style={{'--marquee-duration': duration} as React.CSSProperties}>
            {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
                <Review key={reviewIndex}
                className={reviewClassName?.(reviewIndex % reviews.length)} imgSrc={imgSrc}/>
            ))}
    </div>
    )
}

interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
    imgSrc: string
}

function Review({imgSrc, className, ...props}: ReviewProps) {
    const POSSIBLE_ANIMATION_DELAYS = ['0s', '0,1s', '0.2s', '0.3s', '0.4s', '0.5s',]
    const animationDelay = POSSIBLE_ANIMATION_DELAYS[Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)]

    return (
    <div className={cn(
        'animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-xl shadow-slate-900/5',
        className
    )}
        style={{ animationDelay }}
        {...props}>
            <Phone size={24} className="mb-4 text-gray-500" />
            <img src={imgSrc} alt="Review Image" className="rounded-xl w-full" />
            {/* <Phone imgSrc={imgSrc}/> */}
        </div>
    )
}

function ReviewGrid() {
    /* containerRef is being made/used so it can tell when the desired animation/content is actually within the user's view, so the animation only starts then */
    const containerRef = useRef<HTMLDivElement | null>(null) /* useRef is a hook provided/made by React */
    const isInView = useInView(containerRef, { once:true, amount: 0.4 })
    const columns = splitArray(PHONES, 3)
    const column1 = columns[0]
    const column2 = columns[1]
    const column3 = splitArray(columns[2], 2)

    return (
        <div ref={containerRef} className='relative -mx-4 mt-16 grid h-[49rem] max-h-[150vg]
        grid-cols-1 items-start gap-8 overflow-hidden px-4
        sm:mt-20 md:grid-cols-2 lg:grid-cols-3'>
            {isInView ? (
            <>
            {/* this first one is for if your screen is thin/mobile, then you swant to show everything in column 1 and bring in/move stuff from columns 2 and 3 into coluumn 1 too */}
            <ReviewColumn reviews={[...column1, ...column3.flat(), ...column2]}
                reviewClassName={(reviewIndex) => cn ({
                    'md:hidden': reviewIndex >= column1.length + column3[0].length,
                    'lg:hidden': reviewIndex >= column1.length,
                })
                }
                msPerPixel={10}
                />
                { /* if your screen shows 2 columns then you only need to append the third column into column 2 too */ }
                <ReviewColumn reviews={[...column2, ...column3[1]]}
                className='hidden md:block'
                reviewClassName={(reviewIndex) => reviewIndex >= column2.length ? 'lg:hidden' : ''
                }
                msPerPixel={15}
                />
                <ReviewColumn reviews={column3.flat()}
                className='hidden md:block'
                msPerPixel={10}
                />
        </>
        ) : null}
        </div>
    )
}


export function Reviews() {
    return <MaxWidthWrapper className='relative max-w-5xl'>
        <img aria-hidden='true' src='/what-people-are-buying.png' className='absolute select-none hidden xl:block -left-32 top-1/3'/>
    <ReviewGrid />
    
    </MaxWidthWrapper>
}