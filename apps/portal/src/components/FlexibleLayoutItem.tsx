'use client'

import { Box, useDirection } from '@mantine/core'
import { DetailedHTMLProps, forwardRef, HTMLAttributes, ReactNode } from 'react'

export const FlexibleLayoutItem = forwardRef<
    HTMLDivElement,
    {
        children: ReactNode
        id: string
    } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(function FlexibleLayoutItem(
    {
        children,
        className,
        style,
        id,
    }: {
        children: React.ReactNode
        id: string
    } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    ref
) {
    const { dir } = useDirection()
    return (
        <Box
            component="div"
            dir={dir}
            style={{ ...style }}
            className={className}
            ref={ref}
            key={id}
        >
            {children}
        </Box>
    )
})
