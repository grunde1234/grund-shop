import generateAccessToken from "../src/lib/paypal";

//Test for generating PayPal access token
test('Generate PayPal Access Token', async () => {
    const accessToken = await generateAccessToken();
    console.log('Generated Access Token:', accessToken);
    expect(typeof accessToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(0);
});