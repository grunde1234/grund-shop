# Prisma Field Naming Guide

**Manual scalar fields** (e.g., `orderItems Json`): Use camelCase - your choice for API consistency.

**Auto-generated relations** (e.g., `orderitems orderItem[]`): Prisma lowercases + pluralizes related model name.

**TypeScript usage:**
```typescript
const order = await prisma.order.findUnique({
  where: { id: 'uuid' },
  include: { orderitems: true }  // lowercase relation
});
console.log(order.orderItems);  // camelCase JSON
console.log(order.orderitems);  // relation array
```

**Models → PascalCase
OrderItem**

**Fields → camelCase
orderItems**

**Note**: The naming convention for the relation table is not special and it is your choice