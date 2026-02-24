const salesQuerySchema = {
  querystring: {
    type: "object",
    required: ["year", "month"],
    properties: {
      year: { type: "integer" },
      month: { type: "integer", minimum: 1, maximum: 12 }
    }
  }
}

const productSchema = {
  type: "object",
  properties: {
    product: {
      type: "object",
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        price: { type: "number" }
      }
    },
    quantity: { type: "number" }
  }
}

const customerSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" }
  }
}

const salesResponseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      customer: customerSchema,
      products: { type: "array", items: productSchema },
      totalAmount: { type: "number" },
      saleDate: { type: "string", format: "date-time" }
    }
  }
}

const createSaleBodySchema = {
  type: "object",
  required: ["customerId", "products"],
  properties: {
    customerId: { type: "string" },
    saleDate: { type: "string", format: "date-time" },
    products: {
      type: "array",
      items: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "string" },
          quantity: { type: "number", minimum: 1 }
        }
      }
    }
  }
}

module.exports = {
  salesQuerySchema,
  salesResponseSchema,
  createSaleBodySchema
}