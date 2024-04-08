const pool = require('./dbPool.js');

async function executeQuery(query, params) {
    try {
        const result = await pool.query(query, params);
        return result;
    } catch (err) {
        throw err;
    }
}

async function getProductById(productId) {
    const query = 'SELECT * FROM products WHERE productId = ?';
    const product = await executeQuery(query, [productId]);
    return product;
}

module.exports = executeQuery;