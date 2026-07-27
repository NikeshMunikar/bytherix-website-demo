import crypto from 'crypto'
import { describe, it, expect } from 'vitest'
import { buildEsewaPaymentForm, decodeEsewaCallback, verifyEsewaSignature, type EsewaCallbackPayload } from './esewa.client'
import { config } from '../../config'

function signPayload(fields: Record<string, string>, signedFieldNames: string): string {
  const message = signedFieldNames.split(',').map((k) => `${k}=${fields[k]}`).join(',')
  return crypto.createHmac('sha256', config.ESEWA_SECRET_KEY).update(message).digest('base64')
}

function makeCallback(overrides: Partial<EsewaCallbackPayload> = {}): EsewaCallbackPayload {
  const base = {
    transaction_code:   'TXN123',
    status:             'COMPLETE',
    total_amount:       '1000.0',
    transaction_uuid:   'uuid-1234',
    product_code:       config.ESEWA_MERCHANT_CODE,
    signed_field_names: 'transaction_code,status,total_amount,transaction_uuid,product_code',
    ...overrides,
  }
  const signature = overrides.signature ?? signPayload(base, base.signed_field_names)
  return { ...base, signature }
}

describe('buildEsewaPaymentForm', () => {
  it('builds fields with the configured merchant code and a valid signature', () => {
    const { formUrl, fields } = buildEsewaPaymentForm({
      amount: 500,
      transactionUuid: 'abc-123',
      successUrl: 'https://bytherix.com/checkout/success',
      failureUrl: 'https://bytherix.com/checkout/failure?transactionUuid=abc-123',
    })

    expect(formUrl).toBe(config.ESEWA_FORM_URL)
    expect(fields.product_code).toBe(config.ESEWA_MERCHANT_CODE)
    expect(fields.total_amount).toBe('500')
    expect(fields.transaction_uuid).toBe('abc-123')
    expect(fields.signed_field_names).toBe('total_amount,transaction_uuid,product_code')

    const expectedSignature = signPayload(
      { total_amount: fields.total_amount, transaction_uuid: fields.transaction_uuid, product_code: fields.product_code },
      fields.signed_field_names,
    )
    expect(fields.signature).toBe(expectedSignature)
  })
})

describe('decodeEsewaCallback', () => {
  it('decodes a valid base64-encoded JSON payload', () => {
    const payload = makeCallback()
    const base64 = Buffer.from(JSON.stringify(payload)).toString('base64')
    const decoded = decodeEsewaCallback(base64)
    expect(decoded.transaction_uuid).toBe(payload.transaction_uuid)
    expect(decoded.status).toBe('COMPLETE')
  })

  it('throws on malformed base64/JSON', () => {
    expect(() => decodeEsewaCallback('not-valid-base64-json!!!')).toThrow()
  })
})

describe('verifyEsewaSignature', () => {
  it('accepts a correctly signed payload', () => {
    const payload = makeCallback()
    expect(verifyEsewaSignature(payload)).toBe(true)
  })

  it('rejects a payload with a tampered amount', () => {
    const payload = makeCallback()
    const tampered = { ...payload, total_amount: '999999.0' }
    expect(verifyEsewaSignature(tampered)).toBe(false)
  })

  it('rejects a payload with a tampered signature', () => {
    const payload = makeCallback({ signature: 'not-the-real-signature' })
    expect(verifyEsewaSignature(payload)).toBe(false)
  })

  it('rejects a payload signed with a different signed_field_names order claiming the same fields', () => {
    // Confirms the check is order/content sensitive, not just "same fields present"
    const payload = makeCallback()
    const reordered = { ...payload, signed_field_names: 'status,transaction_code,total_amount,transaction_uuid,product_code' }
    expect(verifyEsewaSignature(reordered)).toBe(false)
  })
})
