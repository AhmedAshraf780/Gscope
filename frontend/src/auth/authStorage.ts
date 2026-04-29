const AUTH_STORAGE_KEY = 'gscope.auth'
const OTP_STORAGE_KEY = 'gscope.pending-otp'

export type StoredAuth = {
  isAuthenticated: boolean
  token: string | null
  user: unknown | null
  raw: unknown
}

export type PendingOtpSession = {
  session: string
  email: string
  source: 'signup' | 'forgotpassword'
}

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const readJson = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const value = window.localStorage.getItem(key)
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as T
  } catch {
    window.localStorage.removeItem(key)
    return null
  }
}

const writeJson = (key: string, value: unknown) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

const getCandidateValue = (source: UnknownRecord, keys: string[]) => {
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }

  return undefined
}

export const extractNestedRecord = (payload: unknown) => {
  if (!isRecord(payload)) {
    return null
  }

  const nested = payload.data
  return isRecord(nested) ? nested : null
}

export const extractString = (payload: unknown, keys: string[]) => {
  if (!isRecord(payload)) {
    return null
  }

  const direct = getCandidateValue(payload, keys)
  if (typeof direct === 'string') {
    return direct
  }

  const nested = extractNestedRecord(payload)
  if (!nested) {
    return null
  }

  const nestedValue = getCandidateValue(nested, keys)
  return typeof nestedValue === 'string' ? nestedValue : null
}

export const extractBoolean = (payload: unknown, keys: string[]) => {
  if (!isRecord(payload)) {
    return null
  }

  const direct = getCandidateValue(payload, keys)
  if (typeof direct === 'boolean') {
    return direct
  }

  const nested = extractNestedRecord(payload)
  if (!nested) {
    return null
  }

  const nestedValue = getCandidateValue(nested, keys)
  return typeof nestedValue === 'boolean' ? nestedValue : null
}

export const extractNumber = (payload: unknown, keys: string[]) => {
  if (!isRecord(payload)) {
    return null
  }

  const direct = getCandidateValue(payload, keys)
  if (typeof direct === 'number') {
    return direct
  }

  const nested = extractNestedRecord(payload)
  if (!nested) {
    return null
  }

  const nestedValue = getCandidateValue(nested, keys)
  return typeof nestedValue === 'number' ? nestedValue : null
}

export const getResponseMessage = (payload: unknown) =>
  extractString(payload, ['message', 'msg', 'error', 'detail']) ?? 'Something went wrong.'

export const getResponseSession = (payload: unknown) =>
  extractString(payload, ['session', 'sessionId', 'otpSession'])

export const getResponseToken = (payload: unknown) =>
  extractString(payload, ['token', 'accessToken', 'access_token', 'jwt'])

export const getResponseUser = (payload: unknown) => {
  if (!isRecord(payload)) {
    return null
  }

  const direct = payload.user
  if (direct !== undefined) {
    return direct
  }

  const nested = extractNestedRecord(payload)
  return nested?.user ?? null
}

export const isResponseSuccess = (payload: unknown) => {
  if (!payload) {
    return false
  }

  const explicit =
    extractBoolean(payload, ['success', 'ok']) ??
    (() => {
      const status = extractString(payload, ['status', 'result'])
      if (!status) {
        return null
      }

      return ['success', 'ok', 'verified'].includes(status.toLowerCase())
    })() ??
    (() => {
      const code = extractNumber(payload, ['statusCode', 'code'])
      return code ? code >= 200 && code < 300 : null
    })()

  if (explicit !== null) {
    return explicit
  }

  if (
    getResponseToken(payload) ||
    getResponseSession(payload) ||
    extractNestedRecord(payload) !== null
  ) {
    return true
  }

  return !extractString(payload, ['error', 'errors'])
}

export const getStoredAuth = () => readJson<StoredAuth>(AUTH_STORAGE_KEY)

export const setStoredAuth = (auth: StoredAuth) => {
  writeJson(AUTH_STORAGE_KEY, auth)
}

export const clearStoredAuth = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export const getPendingOtpSession = () => readJson<PendingOtpSession>(OTP_STORAGE_KEY)

export const setPendingOtpSession = (payload: PendingOtpSession) => {
  writeJson(OTP_STORAGE_KEY, payload)
}

export const clearPendingOtpSession = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(OTP_STORAGE_KEY)
  }
}
