import path from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const viteConfig = defineConfig(async (configEnv) => {
    const { mode } = configEnv
    return {
        plugins: [tailwindcss()],
        // In dev environments, don't clear the terminal after files update
        clearScreen: mode !== 'development',
        // Use an import alias: import from '@/' anywhere instead of 'src/'
        resolve: {
            alias: { '@': path.resolve(__dirname, 'src') },
            dedupe: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@tanstack/react-query',
                '@dhis2/app-runtime',
                // @hisptz/dhis2-ui does not declare react-hook-form as a dependency, so
                // without this its RHF fields load the portal's (React 19) copy and
                // cannot see the form created by the Manager's own copy
                'react-hook-form',
            ],
        },
        // ...other config options here,
    }
})

export default viteConfig
