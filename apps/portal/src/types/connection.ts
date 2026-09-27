export type ConnectionErrorCode =
    | 'INVALID_CREDENTIALS'
    | 'INVALID_URL'
    | 'INVALID_CONNECTION'
    | 'UNKNOWN'

export type ConnectionErrorStatus = {
    status: 'ERROR'
    code: ConnectionErrorCode
    title: string
    message: string
}

export type ConnectionSuccessStatus = {
    status: 'OK'
    name: string
    version: string
}

export type ConnectionStatus = ConnectionErrorStatus | ConnectionSuccessStatus
