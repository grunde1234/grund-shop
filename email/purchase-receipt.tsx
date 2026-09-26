import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Order } from "@/Zod-schemas";
import { formatCurrency } from "@/lib/utils";

const dateFormater = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

const PurchaseReceipt = ({ order }: { order: Order }) => {
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head>
          <Body className="font-sans bg-white">
            <Container className="max-w-xl">
              <Heading>Purchase Receipt</Heading>
              <Section>
                <Row>
                  {/* ORDER ID */}
                  <Column>
                    <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                      Order ID
                    </Text>
                    <Text className="mt-0 mr-4">{order.id.toString()}</Text>
                  </Column>
                  {/* DATE */}
                  <Column>
                    <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                      Purchase date
                    </Text>
                    <Text className="mt-0 mr-4">
                      {dateFormater.format(order.createdAt)}
                    </Text>
                  </Column>
                  {/* PRICE */}
                  <Column>
                    <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                      Price paid total
                    </Text>
                    <Text className="mt-0 mr-4">
                      {formatCurrency(order.totalPrice)}
                    </Text>
                  </Column>
                </Row>
              </Section>
        
              <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
                {order.orderitems.map((item) => (
                  <Row key={item.productId} className="mt-8">
                     {/* IMAGE */}
                    <Column className="w-20">
                      <Img
                        width="80"
                        alt={item.name}
                        className="rounded"
                        src={
                          item.image.startsWith("/")
                            ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                            : item.image
                        }
                      />
                    </Column>
                    {/* NAME, QUANTITY */}
                    <Column className="align-top">
                    {item.name} x {item.qty}
                    </Column>
                    {/*   */}
                    <Column align="right" className="align-top">
                        {formatCurrency(item.price)}
                    </Column>
                  </Row>
                ))}
                {[
                    {name: 'Items', price: order.itemsPrice},
                    {name: 'Tax', price: order.taxPrice},
                    {name: 'Shipping', price: order.shippingPrice},
                    {name: 'Total', price: order.totalPrice}
                ].map(({name, price})=>(
                    <Row key={name} className="py-1">
                        <Column align="right">{name}: </Column>
                        <Column align="right" width={70} className="align-top">
                        <Text className="m-0">{formatCurrency(price)}</Text>
                        </Column>
                    </Row>
                ))}
              </Section>
            </Container>
          </Body>
        </Head>
      </Tailwind>
    </Html>
  );
};

export default PurchaseReceipt;
