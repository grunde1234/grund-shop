import {Resend} from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "@/Zod-schemas";
import PurchaseReceipt from './purchase-receipt'
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

type order = {
    order: Order
}
const sendPurchaseReceipt = async({order}: order) => {
  await resend.emails.send({
    from: `{APP_NAME} <${SENDER_EMAIL}>`,
    to:  order.user.email,
    subject: `Order Comfirmation ${order.id}`,
    react: <PurchaseReceipt order={order} />
  })
}

