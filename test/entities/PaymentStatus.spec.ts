 
 
import PaymentStatus from '../../src/entities/PaymentStatus'
describe('PaymentStatus', () => {
  it('Should create a PaymentStatus when every attribute is valid', () => {
    expect(() => new PaymentStatus('any_id', 'AWAITING_PAYMENT')).not.toThrow(new Error(''))
  })
  it('Should not create a PaymentStatus when status is wrong', () => {
    const wrongStatus = 'WRONG_STATUS'
    expect(() => new PaymentStatus('any_id', wrongStatus as any)).toThrow(new Error(`Status '${wrongStatus}' does not exist`))
  })
})
