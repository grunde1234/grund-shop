const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

export const paypal = {}//functions to create others and capture payments namespace and a paypal service container

//Generate access token
async function generateAccessToken() {
    const {PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET} = process.env;
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString('base64');//Authorization header

    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    if(response.ok){
        const jsonData = await response.json();
        return jsonData.access_token;
    }else{
        const errorMessage = await response.text();
        throw new Error(`Failed to generate access token: ${errorMessage}`);
    }
}