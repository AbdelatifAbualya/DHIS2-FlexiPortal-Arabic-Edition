'use client'
import {
    Responsive as ResponsiveGridLayout,
    useContainerWidth,
} from 'react-grid-layout'
import { FlexibleLayoutConfig } from '@packages/shared/schemas'
import { Container, useDirection } from '@mantine/core'
import { useMemo } from 'react'
import { mirrorLayouts } from '@/utils/layout'

import { fromPairs } from 'lodash-es'
import {
    ScreenSizeId,
    SUPPORTED_SCREEN_SIZES,
} from '@packages/shared/constants'

export function FlexibleLayoutContainer({
    layouts,
    children,
}: {
    layouts: FlexibleLayoutConfig
    children: React.ReactNode
}) {
    const { width, mounted, containerRef } = useContainerWidth()
    const { dir } = useDirection()
    const displayedLayouts = useMemo(
        () => (dir === 'rtl' ? mirrorLayouts(layouts) : layouts),
        [dir, layouts]
    )

    return (
        // react-grid-layout positions items from the left edge of the grid, which only works in a left-to-right
        // container. For right-to-left languages the layouts are mirrored instead, and the items restore the direction.
        <Container
            dir="ltr"
            p={0}
            m={0}
            ref={containerRef}
            fluid
            className="w-full h-full"
        >
            {mounted && (
                <ResponsiveGridLayout
                    dragConfig={{
                        enabled: false,
                        bounded: false,
                    }}
                    resizeConfig={{
                        enabled: false,
                    }}
                    margin={[8, 8]}
                    cols={
                        fromPairs(
                            SUPPORTED_SCREEN_SIZES.map((value) => {
                                return [value.id, value.cols]
                            })
                        ) as { [key in ScreenSizeId]: number }
                    }
                    breakpoints={
                        fromPairs(
                            SUPPORTED_SCREEN_SIZES.map((value) => {
                                return [value.id, value.value]
                            })
                        ) as { [key in ScreenSizeId]: number }
                    }
                    layouts={displayedLayouts}
                    className="layout"
                    maxRows={24}
                    width={width}
                    rowHeight={80}
                >
                    {children}
                </ResponsiveGridLayout>
            )}
        </Container>
    )
}
