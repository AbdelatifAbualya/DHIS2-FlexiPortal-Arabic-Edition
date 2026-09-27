import { FlexibleLayoutConfig } from '@packages/shared/schemas'
import { SUPPORTED_SCREEN_SIZES } from '@packages/shared/constants'

/*
 * react-grid-layout always positions items from the left. For right-to-left languages the layouts are mirrored so
 * that the first item of a row is displayed on the right.
 * */
export function mirrorLayouts(
    layouts: FlexibleLayoutConfig
): FlexibleLayoutConfig {
    const mirrored: FlexibleLayoutConfig = { ...layouts }
    for (const { id, cols } of SUPPORTED_SCREEN_SIZES) {
        const items = layouts[id]
        if (!items) {
            continue
        }
        mirrored[id] = items.map((item) => {
            const width = Math.min(item.w, cols)
            return {
                ...item,
                x: Math.max(0, cols - item.x - width),
            }
        })
    }
    return mirrored
}
