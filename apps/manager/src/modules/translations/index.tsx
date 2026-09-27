import { createFileRoute } from '@tanstack/react-router'

import { TranslationsPage } from '@/shared/components/TranslationsPage/TranslationsPage'
import { ModuleContainer } from '@/shared/components/ModuleContainer'
import i18n from '@dhis2/d2-i18n'

export const Route = createFileRoute('/translations/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <ModuleContainer title={i18n.t('Translations')}>
            <TranslationsPage />
        </ModuleContainer>
    )
}
