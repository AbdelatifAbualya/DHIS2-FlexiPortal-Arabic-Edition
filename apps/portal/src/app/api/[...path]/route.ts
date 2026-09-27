import { NextRequest, NextResponse } from 'next/server'
import { dhis2HttpClient } from '@/utils/api/dhis2'
import { notFound } from 'next/navigation'
import { getCurrentLocale } from '@/i18n/locale'
import { getMessages } from '@/i18n/messages'
import { withDHIS2LocaleParams } from '@/utils/i18n/dhis2'
import { localizeAnalytics } from '@/utils/i18n/analytics'
import {
    getProxyPath,
    isAllowedProxyPath,
    isAnalyticsProxyPath,
    isTranslatableProxyPath,
} from '@/utils/api/proxy'

export async function GET(request: NextRequest) {
    const urlToForward = getProxyPath(request.url as string)

    if (!isAllowedProxyPath(urlToForward)) {
        return notFound()
    }

    if (!isTranslatableProxyPath(urlToForward)) {
        const response = await dhis2HttpClient.get(urlToForward)
        return NextResponse.json(response)
    }

    const locale = await getCurrentLocale()
    const response = await dhis2HttpClient.get(
        withDHIS2LocaleParams(urlToForward, locale)
    )

    const body = isAnalyticsProxyPath(urlToForward)
        ? localizeAnalytics(response, {
              locale,
              messages: getMessages(locale),
          })
        : response

    // The response depends on the language cookie of the visitor
    return NextResponse.json(body, { headers: { Vary: 'Cookie' } })
}
