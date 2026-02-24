const Customer = require("../models/Customer");

/**
 * Register a new customer
 *
 * Accepts a customer name, email, and password from the request body 
 * and creates a new customer in the database.
 *
 * Request Body:
 *   - name (string, required): The name of the customer
 *   - email (string, required, valid email): The email of the customer
 *   - password (string, required, minLength 6): The password of the customer
 *
 * Response (201 Created):
 *   - message (string): Confirmation message
 *   - customer (object):
 *       - name (string)
 *       - email (string)
 *
 * Response (400):
 *   - message (string): "Email already registered"
 *
 * Response (500):
 *   - Error object
 *
 * @param {import('fastify').FastifyRequest} request - Fastify request object containing customer data in request.body
 * @param {import('fastify').FastifyReply} reply - Fastify reply object used to send the response
 * @returns {Promise<void>} Sends the created customer object with a success message
 */
async function registerCustomer(request, reply) {
  try {
    const { name, email, password } = request.body;

    const existing = await Customer.findOne({ email });
    if (existing) return reply.status(400).send({ message: "Email already registered" });

    const customer = await Customer.create({ name, email, password });

    return reply.status(201).send({
      message: "Customer registered successfully",
      customer: { name: customer.name, email: customer.email }
    });
  } catch (error) {
    reply.status(500).send(error);
  }
}

/**
 * Login a customer
 *
 * Accepts email and password, verifies credentials, and returns a JWT token.
 *
 * Request Body:
 *   - email (string, required, valid email)
 *   - password (string, required)
 *
 * Response (200 OK):
 *   - message (string): "Login successful"
 *   - token (string): JWT token to be used for authenticated requests
 *
 * Response (401 Unauthorized):
 *   - message (string): "Invalid credentials"
 *
 * Response (500):
 *   - Error object
 *
 * @param {import('fastify').FastifyRequest} request - Fastify request object containing login data in request.body
 * @param {import('fastify').FastifyReply} reply - Fastify reply object used to send the response
 * @returns {Promise<void>} Sends a JWT token upon successful login
 */
async function loginCustomer(request, reply) {
  try {
    const { email, password } = request.body;
    const customer = await Customer.findOne({ email });
    if (!customer) return reply.status(401).send({ message: "Invalid credentials" });

    const valid = await customer.comparePassword(password);
    if (!valid) return reply.status(401).send({ message: "Invalid credentials" });

    const token = await reply.jwtSign({ customerId: customer._id, role: customer.role });

    return reply.send({ message: "Login successful", token });
  } catch (error) {
    reply.status(500).send(error);
  }
}

/**
 * Logout a customer
 *
 * Since JWT is stateless, logout simply instructs the client
 * to delete the token from its storage (localStorage, sessionStorage, or memory).
 *
 * Response (200 OK):
 *   - message (string): "Logout successful. Please delete the token on client side."
 *
 * @param {import('fastify').FastifyRequest} request - Fastify request object
 * @param {import('fastify').FastifyReply} reply - Fastify reply object used to send the response
 * @returns {Promise<void>} Sends a logout confirmation message
 */
async function logoutCustomer(request, reply) {
  return reply.send({ message: "Logout successful. Please delete the token on client side." });
}

module.exports = { registerCustomer, loginCustomer, logoutCustomer };