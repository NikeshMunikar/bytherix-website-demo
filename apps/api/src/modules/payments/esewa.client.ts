import crypto from 'crypto'
import { config } from '../../config'
import { logger } from '../../config/logger'

// eSewa ePay v2: signature = base64(HMAC-SHA256(secret, "k1=v1,k2=v2,...")) built
// from exactly the fields listed (in order) by `signed_field_names`.
function buildSignature(fields: Record<string, string | number>, signedFieldNames: string): string {
  const message = signedFieldNames
    .split(',')
    .map((key) => `${key}=${fields[key]}`)
    .join(',')
  return crypto.createHmac('sha256', config.ESEWA_SECRET_KEY).update(message).digest('base64')
}

export interface EsewaFormFields {
  amount:                  string
  tax_amount:              string
  total_amount:            string
  transaction_uuid:        string
  product_code:            string
  product_service_charge:  string
  product_delivery_charge: string
  success_url:             string
  failure_url:             string
  signed_field_names:      string
  signature:               string
}

export function buildEsewaPaymentForm(params: {
  amount: number
  transactionUuid: string
  successUrl: string
  failureUrl: string
}): { formUrl: string; fields: EsewaFormFields } {
  const signedFieldNames = 'total_amount,transaction_uuid,product_code'
  const fields = {
    amount:                  params.amount.toString(),
    tax_amount:               '0',
    total_amount:            params.amount.toString(),
    transaction_uuid:        params.transactionUuid,
    product_code:            config.ESEWA_MERCHANT_CODE,
    product_service_charge:  '0',
    product_delivery_charge: '0',
    success_url:             params.successUrl,
    failure_url:             params.failureUrl,
    signed_field_names:      signedFieldNames,
  }

  const signature = buildSignature(
    { total_amount: fields.total_amount, transaction_uuid: fields.transaction_uuid, product_code: fields.product_code },
    signedFieldNames,
  )

  return { formUrl: config.ESEWA_FORM_URL, fields: { ...fields, signature } }
}

export interface EsewaCallbackPayload {
  transaction_code:   string
  status:             string
  total_amount:        string
  transaction_uuid:   string
  product_code:       string
  signed_field_names: string
  signature:          string
  [key: string]: string
}

export function decodeEsewaCallback(base64Data: string): EsewaCallbackPayload {
  const json = Buffer.from(base64Data, 'base64').toString('utf-8')
  return JSON.parse(json)
}

export function verifyEsewaSignature(payload: EsewaCallbackPayload): boolean {
  const expected = buildSignature(payload, payload.signed_field_names)
  const a = Buffer.from(expected)
  const b = Buffer.from(payload.signature)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

// Belt-and-suspenders server-to-server confirmation, independent of the
// (spoofable) browser redirect — recommended by eSewa's own integration guide.
export async function checkEsewaTransactionStatus(params: {
  transactionUuid: string
  totalAmount: number
}): Promise<{ status: string } | null> {
  const url = new URL(config.ESEWA_STATUS_URL)
  url.searchParams.set('product_code', config.ESEWA_MERCHANT_CODE)
  url.searchParams.set('total_amount', params.totalAmount.toString())
  url.searchParams.set('transaction_uuid', params.transactionUuid)

  try {
    const res = await fetch(url.toString())
    if (!res.ok) return null
    return await res.json() as { status: string }
  } catch (err) {
    logger.error({ err }, 'eSewa status-check request failed')
    return null
  }
}
