import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../src/generated/prisma';
import ws from 'ws';
import { Item } from '@radix-ui/react-dropdown-menu';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Instantiates the Prisma adapter using the connection string to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon({ connectionString: connectionString });

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();//conpute converts the decimal into strings before being taken as decimal and stored in DB
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart:{
      ItemsPrice:{
        needs: {itemsPrice: true},//indicates the field needed from DB
        compute(cart){
          return cart.itemsPrice.toString();
        }
      },
      ShippingPrice:{
        needs: {shippingPrice: true},//indicates the field needed from DB
        compute(cart){
          return cart.shippingPrice.toString();
        }
      },
      taxPrice:{
        needs: {taxPrice: true},//indicates the field needed from DB
        compute(cart){
          return cart.taxPrice.toString();
        }
      },
      totalPrice:{
        needs: {totalPrice: true},//indicates the field needed from DB
        compute(cart){
          return cart.totalPrice.toString();
        }
      },
    },
    order:{
      ItemsPrice:{
        needs: {itemsPrice: true},//indicates the field needed from DB
        compute(cart){
          return cart.itemsPrice.toString();
        }
      },
      ShippingPrice:{
        needs: {shippingPrice: true},//indicates the field needed from DB
        compute(cart){
          return cart.shippingPrice.toString();
        }
      },
      taxPrice:{
        needs: {taxPrice: true},//indicates the field needed from DB
        compute(cart){
          return cart.taxPrice.toString();
        }
      },
      totalPrice:{
        needs: {totalPrice: true},//indicates the field needed from DB
        compute(cart){
          return cart.totalPrice.toString();
        }
      },
    },
    orderItem:{
      price:{
        compute(orderItem){
          return orderItem.price.toString();
        }
      },
    },
  },
});
//this handles connection pooling for serverless environments