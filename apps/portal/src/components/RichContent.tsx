'use client'

import JsxParser from 'react-jsx-parser'

export function RichContent({ content }: { content: string }) {
    return (
        // The direction follows the content, so that texts that are not translated yet are still displayed correctly
        <div dir="auto">
            <JsxParser
                autoCloseVoidElements
                renderError={({ error }) => {
                    return <div>{error}</div>
                }}
                onError={(error) => {
                    console.error(error)
                }}
                jsx={content}
            />
        </div>
    )
}
