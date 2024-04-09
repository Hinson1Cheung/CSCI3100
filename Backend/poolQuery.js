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
    const sql = 'SELECT * FROM product WHERE productId = ?';
    const product = await executeQuery(sql, [productId]);
    return product[0][0];
}

module.exports = {
    executeQuery,
    getProductById
};