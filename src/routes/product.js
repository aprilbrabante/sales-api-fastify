const productController = require('../controllers/product')

const { productQuerySchema, productResponseSchema, 
    getProductsQuerySchema, getProductsResponseSchema} = require("../schemas/productSchema")

async function routes(fastify, options) {

    const productRouteOptions = {
        schema: {
            description: "Register Product",
            body: productQuerySchema,
            response: {
            201: productResponseSchema
            }
        },
        preHandler: [fastify.authorizeAdmin]
    };

    const getProductsRouteOptions = {
        schema: {
            description: "Get all products (optional filtering by name or price)",
            querystring: getProductsQuerySchema,
            response: {
            200: getProductsResponseSchema
            }
        },
        preHandler: [fastify.authenticate]
    };

    /**
     * POST /api/v1/product/create
     * Register new product
     * Query Parameters:
     *   - name (string, required)
     *   - price (number, required)
     * Response:
     *   - 201: created product
    */
    fastify.post("/create", productRouteOptions, productController.createProduct);

    /**
     * GET /api/v1/product
     * Get all products, optionally filtered by name or price
     * Query Parameters (optional):
     *   - name (string): filter by product name
     *   - minPrice (number): minimum price
     *   - maxPrice (number): maximum price
     * Response:
     *   - 200: array of products { name, price }
     */
    fastify.get("/", getProductsRouteOptions, productController.getAllProducts);

}

module.exports = routes;