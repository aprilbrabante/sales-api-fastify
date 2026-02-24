const customerQuerySchema = {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string" }
    }
}

const customerSchema = {
  type: "object",
  properties: {
        name: { type: "string" },
        email: { type: "string" }
  }
}

const customerResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    customer: customerSchema
  }
};

const loginQuerySchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 }
  }
};

const loginResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    token: { type: "string" } 
  },
  required: ["message", "token"]
};

module.exports = {
  customerQuerySchema,
  customerResponseSchema, 
  loginQuerySchema, 
  loginResponseSchema}