'use client'

import { HTMLAttributes, JSX, ReactNode } from 'react'
import { LazyMotion, domAnimation, MotionProps, m } from 'framer-motion'

type Props = {
    children: ReactNode
    multiplier?: number
} & HTMLAttributes<HTMLDivElement> &
    MotionProps

export default function FadeInWhenVisible(props: Props): JSX.Element {
    const { children, multiplier = 1 } = props

    return (
        <LazyMotion features={domAnimation}>
            <m.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
                transition={{
                    duration: 0.2 * (multiplier + 1),
                    ease: 'easeInOut',
                }}
                variants={{
                    visible: { opacity: 1, scale: 1, translateY: 0 },
                    hidden: { opacity: 0, scale: 0.5, translateY: 100 },
                }}
                {...props}
            >
                {children}
            </m.div>
        </LazyMotion>
    )
}
