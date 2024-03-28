import axios from 'axios';

const generateToken = async () => {
  const secret = process.env.MPESA_SECRET;
  const consumer = process.env.MPESA_CONSUMER_KEY;
  const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");
  try {
    const result = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    );
    console.log(result.data.access_token);
    return result.data.access_token;
  } catch (err) {
    console.log(err.message);
    throw err; // Re-throw the error to handle it in the calling code
  }
};

const mpesaStkPush = async (req, res) => {
    const amount = req.body.amount;
    const phone = req.body.phone.substring(1);
    const date = new Date();
    const timestamp = date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);
    const passkey = process.env.MPESA_PASSKEY;
    const shortcode = process.env.SHORT_CODE;
    const password = new Buffer.from(shortcode + passkey + timestamp).toString("base64");
    const token = await generateToken();
    console.log(token);
    await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        "BusinessShortCode": shortcode,    
        "Password": password,    
        "Timestamp":timestamp,    
        "TransactionType": "CustomerPayBillOnline",    
        "Amount": amount,    
        "PartyA": `254${phone}`,    
        "PartyB": shortcode,    
        "PhoneNumber": `254${phone}`,    
        "CallBackURL": "https://mydomain.com/pat",    
        "AccountReference": `254${phone}`,    
        "TransactionDesc": "Test"
      },
      { headers: {
        Authorization: `Bearer ${token}`
      }, }
    ).then((data) => {
      console.log(data.data);
      res.status(200).json(data.data);
    }).catch((err) => {
      console.log(err.message);
      res.status(400).json(err.message);
    });
}

const mpesaCallback = async (req, res) => {
  const callback = req.body;
  console.log(callback);
}

export { mpesaStkPush, generateToken, mpesaCallback };