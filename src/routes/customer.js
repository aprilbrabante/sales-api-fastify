const customerController = require('../controllers/customer')

const { customerQuerySchema, customerResponseSchema, 
    loginQuerySchema, loginResponseSchema} = require("../schemas/customerSchema")

async function routes(fastify, options) {

    const customerRoutesOptions = {
        schema: {
            description: "Register new customer",
            body: customerQuerySchema,
            response: {
            201: customerResponseSchema
            }
        }
    };

    const loginRoutesOptions = {
        schema: {
            description: "Login a customer and return JWT",
            body: loginQuerySchema,
            response: {
            200: loginResponseSchema,
            401: {
                type: "object",
                properties: {
                message: { type: "string" }
                }}
            }
        }
    };

    /**
     * POST /api/v1/customer/create
     * Registers a new customer
     * Request Body:
     *   - name (string, required)
     *   - email (string, required, valid email)
     *   - password (string, required, min 6 characters)
     * Response:
     *   - 201: customer object with id, name, email
     *   - 400: email already registered
     *   - 500: internal server error
     */
    fastify.post("/create", customerRoutesOptions, customerController.registerCustomer);

    /**
     * POST /api/v1/customer/login
     * Logs in a customer and returns a JWT token
     * Request Body:
     *   - email (string, required, valid email)
     *   - password (string, required)
     * Response:
     *   - 200: { message: "Login successful", token: JWT }
     *   - 401: invalid credentials
     *   - 500: internal server error
     */
    fastify.post("/login", loginRoutesOptions, customerController.loginCustomer);

    /**
     * POST /api/v1/customer/logout
     * Logs out the customer
     * Note: JWT is stateless, so logout instructs client to delete the token
     * PreHandler:
     *   - authenticate: verifies JWT before logout
     * Response:
     *   - 200: { message: "Logout successful. Please delete the token on client side." }
     */
    fastify.post("/logout", { preHandler: [fastify.authenticate] }, customerController.logoutCustomer);

}

module.exports = routes;