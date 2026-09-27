import { describe, expect, it } from 'vitest'
import { mirrorLayouts } from './layout'

describe('mirrorLayouts', () => {
    it('mirrors the horizontal position of items for each screen size', () => {
        const mirrored = mirrorLayouts({
            lg: [
                { i: 'a', x: 0, y: 0, w: 4, h: 2 },
                { i: 'b', x: 4, y: 0, w: 8, h: 2 },
            ],
            md: [{ i: 'a', x: 0, y: 0, w: 10, h: 2 }],
            sm: [{ i: 'a', x: 2, y: 1, w: 2, h: 3 }],
        })
        expect(mirrored.lg).toEqual([
            { i: 'a', x: 8, y: 0, w: 4, h: 2 },
            { i: 'b', x: 0, y: 0, w: 8, h: 2 },
        ])
        expect(mirrored.md).toEqual([{ i: 'a', x: 0, y: 0, w: 10, h: 2 }])
        expect(mirrored.sm).toEqual([{ i: 'a', x: 2, y: 1, w: 2, h: 3 }])
    })

    it('never produces negative positions for items wider than the grid', () => {
        const mirrored = mirrorLayouts({
            sm: [{ i: 'a', x: 0, y: 0, w: 12, h: 2 }],
        })
        expect(mirrored.sm![0].x).toBe(0)
    })

    it('keeps screen sizes that are not configured', () => {
        const xs = [{ i: 'a', x: 1, y: 0, w: 2, h: 2 }]
        const mirrored = mirrorLayouts({ xs })
        expect(mirrored.xs).toBe(xs)
        expect(mirrored.lg).toBeUndefined()
    })

    it('does not mutate the input', () => {
        const layouts = { lg: [{ i: 'a', x: 0, y: 0, w: 4, h: 2 }] }
        mirrorLayouts(layouts)
        expect(layouts.lg[0].x).toBe(0)
    })
})
