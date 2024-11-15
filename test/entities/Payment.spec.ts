import PaymentStatus from '../../src/entities/PaymentStatus'
import Payment from '../../src/entities/Payment'
const mockPaymentStatus: PaymentStatus[] = [
  {
    id: 'any_id',
    status: 'AWAITING_PAYMENT'
  },
  {
    id: 'any_id',
    status: 'PAYMENT_ACCEPTED'
  }
]

const paymentValue = 85.90

describe('Payment', () => {
  it('Should create a Payment when all attributes are valids', () => {
    expect(
      () => new Payment('any_id', 'any_order_id', paymentValue, mockPaymentStatus, 'any_qr_code', 'any_integration_id')
    ).not.toThrow(new Error(''))
  })
  it('Should not create a Payment when value is lower or equal to 0', () => {
    const wrongPaymentValue = -1
    expect(
      () => new Payment('any_id', 'any_order_id', wrongPaymentValue, mockPaymentStatus, 'any_qr_code', 'any_integration_id')
    ).toThrow(new Error('Value must be greater than 0'))
  })
  it('Should return true when Payment is already approved', () => {
    const sut = new Payment('any_id', 'any_order_id', paymentValue, mockPaymentStatus, 'any_qr_code', 'any_integration_id')
    expect(sut.isApproved()).toBe(true)
  })
})
