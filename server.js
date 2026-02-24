
const fastify = require('fastify')({logger:true});
const mongoose = require('mongoose');
require("dotenv").config();

// Register Swagger (OpenAPI)
fastify.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'fastify-api',
      version: '1.0.0'
    }
  }
})

// Register Swagger UI
fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  exposeRoute: true
})

// Import Routes
const customerRoute  = require("./src/routes/customer")
const productRoute  = require("./src/routes/product")
const salesRoute  = require("./src/routes/sales")

mongoose.connect(process.env.MONGODB_STRING).then(() => console.log("Connected to DB"))
.catch((e) => console.log("Error Connection to DB", e));

fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET || "supersecretkey"
})

// Authentication decorator
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ message: "Unauthorized" })
  }
})

// Role-based decorator
fastify.decorate("authorizeAdmin", async function (request, reply) {
  try {
    await request.jwtVerify();

    if (request.user.role !== "admin") {
      return reply.status(403).send({ message: "Forbidden: Admins only" });
    }

  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
});

fastify.register(customerRoute, {prefix: "/api/v1/customers"});
fastify.register(productRoute, {prefix: "/api/v1/products"});
fastify.register(salesRoute, {prefix: "/api/v1/sales"});

const start = async() => {
    try {
        await fastify.listen({port: process.env.PORT || 4000,
            host: '0.0.0.0'
        })
        fastify.log.info(`Server is running on port ${fastify.server.address().port}`)
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);      
    }
}

start()