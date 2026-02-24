const productQuerySchema = {
    type: "object",
    required: ["name", "price"],
    properties: {
        name: { type: "string" },
        price: { type: "integer", minimum: 1 }
    }
}

const productSchema = {
  type: "object",
  properties: {
        name: { type: "string" },
        price: { type: "number" }
  }
}

const productResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    product: productSchema
  }
};

const getProductsQuerySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Filter by product name (optional)" },
    minPrice: { type: "number", minimum: 0, description: "Minimum price filter (optional)" },
    maxPrice: { type: "number", minimum: 0, description: "Maximum price filter (optional)" }
  }
};

const getProductsResponseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      price: { type: "number" }
    },
    required: ["name", "price"]
  }
};

module.exports = { productQuerySchema, productResponseSchema, getProductsQuerySchema, getProductsResponseSchema }