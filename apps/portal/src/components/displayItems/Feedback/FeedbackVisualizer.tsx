'use client'

import { useTranslations } from 'next-intl'
import {
    Alert,
    Button,
    Group,
    Textarea,
    TextInput,
    useMantineTheme,
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useCallback, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    FeedbackConfig,
    FeedbackItem,
    feedbackSchema,
} from '@packages/shared/schemas'
import { sendFeedbackEmail } from '@/utils/sendEmail'

export default function FeedbackVisualizer({ item }: { item: FeedbackItem }) {
    const theme = useMantineTheme()
    const t = useTranslations('feedback')
    const tCommon = useTranslations('common')

    const form = useForm({
        shouldFocusError: false,
        resolver: zodResolver(feedbackSchema),
        reValidateMode: 'onChange',
    })
    const formRef = useRef<HTMLFormElement>(null)

    const onFormSubmit = useCallback(
        async (data: FeedbackConfig) => {
            try {
                await sendFeedbackEmail({ data, item })
                form.reset()
                notifications.show({
                    title: tCommon('success'),
                    message: t('sent'),
                    color: 'green',
                })
            } catch (e) {
                console.log('Error sending feedback:', e)
                notifications.show({
                    title: tCommon('error'),
                    message: t('sendError'),
                    color: 'red',
                })
            }
        },
        [form, item, t, tCommon]
    )

    const handleCancel = async () => {
        form.reset()
    }

    return (
        <FormProvider {...form}>
            <div className="flex flex-col gap-8 p-4">
                <div className="flex flex-col gap-4 w-full">
                    <Alert
                        icon={<IconInfoCircle size={24} />}
                        color={theme.primaryColor}
                        variant="light"
                        title={tCommon('information')}
                        styles={{
                            root: {
                                border: `1px solid ${theme.colors[theme.primaryColor][2]}`,
                                backgroundColor:
                                    theme.colors[theme.primaryColor][0],
                            },
                            title: {
                                color: theme.colors.gray[9],
                                fontWeight: 700,
                            },
                            message: { color: theme.colors.gray[9] },
                        }}
                    >
                        {t('intro')}
                    </Alert>
                </div>
                <form
                    onSubmit={form.handleSubmit(onFormSubmit)}
                    ref={formRef}
                    className="flex flex-col gap-4"
                >
                    <TextInput
                        {...form.register('email')}
                        type="email"
                        required
                        label={t('email')}
                        size="md"
                        styles={{
                            input: {
                                border: `1px solid ${theme.colors.gray[4]}`,
                                '&:focus': {
                                    borderColor:
                                        theme.colors[theme.primaryColor][5],
                                },
                            },
                            label: { color: theme.colors.gray[9] },
                        }}
                    />
                    <TextInput
                        {...form.register('name')}
                        type="text"
                        required
                        label={t('fullName')}
                        size="md"
                        styles={{
                            input: {
                                border: `1px solid ${theme.colors.gray[4]}`,
                                '&:focus': {
                                    borderColor:
                                        theme.colors[theme.primaryColor][5],
                                },
                            },
                            label: { color: theme.colors.gray[9] },
                        }}
                    />
                    <Textarea
                        {...form.register('message')}
                        label={t('message')}
                        required
                        minRows={6}
                        size="md"
                        styles={{
                            input: {
                                border: `1px solid ${theme.colors.gray[4]}`,
                                '&:focus': {
                                    borderColor:
                                        theme.colors[theme.primaryColor][5],
                                },
                            },
                            label: { color: theme.colors.gray[9] },
                        }}
                    />
                </form>
                <Group justify="flex-end" gap="sm">
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        color={theme.colors.gray[6]}
                        styles={{ root: { borderColor: theme.colors.gray[4] } }}
                    >
                        {tCommon('cancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            if (formRef.current) {
                                formRef.current?.requestSubmit()
                            }
                        }}
                        variant="filled"
                        color={theme.primaryColor}
                        loading={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? t('sending') : t('send')}
                    </Button>
                </Group>
            </div>
        </FormProvider>
    )
}
