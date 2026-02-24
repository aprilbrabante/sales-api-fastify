const Sales = require("../models/Sales")
const Customer = require("../models/Customer");
const Product = require("../models/Product");

/**
 * Get sales by year and month
 *
 * Returns all sales for a specific year and month, including
 * customer details and purchased products.
 *
 * Query Parameters:
 *   - year (integer, required): the year to filter sales
 *   - month (integer, required, 1-12): the month to filter sales
 *
 * @param {FastifyRequest} request - Fastify request object
 * @param {FastifyReply} reply - Fastify reply object
 * @returns {Promise<void>} Sends an array of sales
 */
async function getSalesByMonth(request, reply) {
    try {

        const { year, month } = request.query;

        if (!year || !month || month < 1 || month > 12) {
          return reply.status(400).send({ message: "Valid year and month (1-12) are required." });
        }

        // Start and end dates of the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Query sales
        const sales = await Sales.find({
        saleDate: { $gte: startDate, $lte: endDate }
        })
        .populate("customer")
        .populate("products.product");
        
        if (sales.length <= 0) {
            return reply.status(404).send({message: "No sales found"})
        }

        return reply.status(200).send(sales);

    } catch (error) {
        reply.status(500).send(error);
        
    }

}

/**
 * Create a new sale record
 *
 * Accepts a customer ID, an array of products with quantities, 
 * and an optional sale date. Calculates totalAmount automatically.
 *
 * Request Body:
 *   - customerId (string, required): MongoDB ObjectId of the customer
 *   - saleDate (string, optional): ISO date-time of the sale
 *   - products (array, required): 
 *       - productId (string, required): MongoDB ObjectId of the product
 *       - quantity (number, required): quantity purchased (min 1)
 *
 * Response (201 Created):
 *   - message: string
 *   - product: object containing:
 *       - name: string
 *       - price: number
 *
 * @param {FastifyRequest} request - Fastify request object
 * @param {FastifyReply} reply - Fastify reply object
 * @returns {Promise<void>} Sends the created sale object
 */
async function createSale(request, reply) {
  try {

    const { customerId } = request.user;
    const { products, saleDate } = request.body;

    // Validate customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return reply.status(400).send({ message: "Customer not found" });
    }

    // Validate if products is inputted
    if (!Array.isArray(products) || products.length === 0) {
      return reply.status(400).send({ message: "Products array is required" });
    }

    // Validate products and calculate totalAmount
    let totalAmount = 0;
    const productsData = [];

    for (const p of products) {
        
        const product = await Product.findById(p.productId);
        // Check if product does not exists in Product Table
        if (!product) {
            return reply.status(400).send({ message: `Product not found: ${p.productId}` });
        }

        productsData.push({
            product: product._id,
            quantity: p.quantity
        });

        totalAmount += product.price * p.quantity;
    }

    // Create new Sale record
    const sale = new Sales({
      customer: customer._id,
      products: productsData,
      totalAmount,
      saleDate: saleDate ? new Date(saleDate) : new Date()
    });

    // Save first
    await sale.save();

    // Populate fields
    const result = await Sales.findById(sale._id)
    .populate("customer")
    .populate("products.product");

    // Send reply
    return reply.status(201).send(result);

  } catch (error) {
    reply.status(500).send(error);
  }
}


module.exports = {
  getSalesByMonth,
  createSale
}