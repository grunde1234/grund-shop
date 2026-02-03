import generateAccessToken from "../src/lib/paypal";
import { paypal } from "../src/lib/paypal";

//Test for generating PayPal access token
test('Generate PayPal Access Token', async () => {
    const accessToken = await generateAccessToken();
    console.log('Generated Access Token:', accessToken);
    expect(typeof accessToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(0);
});

//Test for creating a PayPal order
test('Create PayPal Order', async () => {
    const token = await generateAccessToken();
    const price = 10.00; // Example price
    const order = await paypal.createOrder(price);//methods in paypal service container
    console.log('Created Order:', order);
    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('status');
    expect(order.status).toBe('CREATED');
/*     expect(order.purchase_units[0].amount.value).toBe(price.toFixed(2));
 */})

 //Test to capture a PayPal payment with mock order
test('simulate PayPal Payment', async () => {
    const orderId = '100';
    
    const mockCapturePayments = jest.spyOn(paypal, 'capturePayment').mockResolvedValue({
        id: orderId,
        status: 'COMPLETED',});

    const captureResponse = await paypal.capturePayment(orderId);
    expect(captureResponse).toHaveProperty('id', orderId);
    expect(captureResponse).toHaveProperty('status', 'COMPLETED');

    mockCapturePayments.mockRestore();//Restore original implementation
})