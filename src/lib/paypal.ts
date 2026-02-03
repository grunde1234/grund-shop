const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';//where to send server header to for the paypal api server access

export const paypal = {
    createOrder: async function createOrder(price: number){
        const accessToken = await generateAccessToken();

        const url = `${base}/v2/checkout/orders`;//url to request from

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
             body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: price
                    },
                }]
             })
        })

    return handleResponse(response);

    },
    capturePayment: async function capturePayment(orderID: string){
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderID}/capture`;//url to request from

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return handleResponse(response);
    }
}

//Generate access token
async function generateAccessToken() {
    const {PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET} = process.env;
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString('base64');//Authorization header

    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,//auth is the base64 encoded client id and secret and permanent
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await handleResponse(response);
    return data.access_token;//return the access token
}

async function handleResponse(response: Response) {
 if(response.ok){
        return  response.json()
    }else{
        const errorMessage = await response.text();
        throw new Error(`Failed to generate access token: ${errorMessage}`);
    }
}

export default generateAccessToken;