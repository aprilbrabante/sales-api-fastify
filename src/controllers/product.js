const Product = require("../models/Product")

/**
 * Create a new product
 *
 * Accepts a product name and price from the request body and creates a new product in the database.
 *
 * Request Body:
 *   - name (string, required): The name of the product
 *   - price (number, required): The price of the product (minimum 1)
 *
 * Response (201 Created):
 *   - message: string - confirmation message
 *   - product: object containing:
 *       - name: string
 *       - price: number
 *
 * @param {FastifyRequest} request - Fastify request object containing the product data in `request.body`
 * @param {FastifyReply} reply - Fastify reply object used to send the response
 * @returns {Promise<void>} Sends the created product object with a success message
 */
async function createProduct(request, reply) {
  try {

    const {...rest} = request.body

    const product = await Product.create({
      ...rest
    })

    return reply.status(201).send(
        { message: "Product created successfully", 
            product: {name: product.name, price: product.price} })
  } catch (error) {
    reply.status(500).send(error)
  }

}

/**
 * Get all products
 *
 * Optionally filters products by name, minimum price, and maximum price.
 *
 * Query Parameters (optional):
 *   - name (string): filters products containing this string (case-insensitive)
 *   - minPrice (number): minimum price
 *   - maxPrice (number): maximum price
 *
 * Response (200 OK):
 *   - Array of product objects:
 *       - name (string)
 *       - price (number)
 *
 * Response (500):
 *   - Error object if something goes wrong
 *
 * @param {import('fastify').FastifyRequest} request - Fastify request object containing query params
 * @param {import('fastify').FastifyReply} reply - Fastify reply object used to send the response
 * @returns {Promise<void>} Sends an array of products matching the filters
 */
async function getAllProducts(request, reply) {
  try {
    const { name, minPrice, maxPrice } = request.query;

    // Build dynamic filter
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // case-insensitive match
    }
    if (minPrice !== undefined) {
      filter.price = { ...filter.price, $gte: minPrice };
    }
    if (maxPrice !== undefined) {
      filter.price = { ...filter.price, $lte: maxPrice };
    }

    const products = await Product.find(filter);

    if (products.length <=0) {
        return reply.status(404).send({message: "No products found"})
    }

    return reply.status(200).send(products.map(p => ({
      name: p.name,
      price: p.price
    })));

  } catch (error) {

    reply.status(500).send(error);
  }
}

module.exports = {
  createProduct,
  getAllProducts
}