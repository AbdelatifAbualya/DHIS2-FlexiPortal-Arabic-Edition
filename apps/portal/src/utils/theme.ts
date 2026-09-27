import { AppAppearanceConfig } from '@packages/shared/schemas'
import { createTheme } from '@mantine/core'
import { generateColors } from '@mantine/colors-generator'
import { APP_FONT_FAMILY } from '@/fonts/family'

const fontTheme = {
    fontFamily: APP_FONT_FAMILY,
    headings: {
        fontFamily: APP_FONT_FAMILY,
    },
}

export function getAppTheme(appearanceConfig?: AppAppearanceConfig) {
    if (!appearanceConfig) {
        return createTheme(fontTheme)
    }
    const defaultPrimaryColor = '#2c6693'
    const primaryColorShades = generateColors(
        appearanceConfig?.colors?.primary ?? defaultPrimaryColor
    )

    return createTheme({
        colors: {
            custom: primaryColorShades,
        },
        primaryColor: 'custom',
        ...fontTheme,
    })
    //
    // return createTheme({
    // 	primaryColor: appearanceConfig?.colors?.primary,
    // });
}
