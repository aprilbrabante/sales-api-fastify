const salesController = require('../controllers/sales')
const { salesQuerySchema, salesResponseSchema, createSaleBodySchema  } = require("../schemas/salesSchemas");

async function routes(fastify, options) {

    const salesRouteOptions = {
        schema: {
            description: "Get Sales by Year and Month",
            querystring: salesQuerySchema.querystring,
            response: {
                200: salesResponseSchema
            }
        },
        preHandler: [fastify.authorizeAdmin]
    };

    const createSalesRoutesOptions = {
        schema: {
            description: "Create Sales by Customer and Products",
            body: createSaleBodySchema,
            response: { 
                201: salesResponseSchema.items 
            }
        },
        preHandler: [fastify.authorizeAdmin]
    }
    
    /**
     * GET /api/v1/sales
     * Returns all sales for a given year and month
     * Query Parameters:
     *   - year (integer, required)
     *   - month (integer, 1-12, required)
     * Response:
     *   - 200: array of sales with customer and products
     */
    fastify.get("/", salesRouteOptions, salesController.getSalesByMonth);

    /**
     * POST /api/v1/sales/create
     * Register new sales by customer and products
     * Query Parameters:
     *   - customerId (objectId, required)
     *   - products (array, required)
     * Response:
     *   - 201: created sales with customer and products
     */
    fastify.post("/create", createSalesRoutesOptions, salesController.createSale);

}

module.exports = routes;