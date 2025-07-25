const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1]; 

        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    message: 'Auth Failed',
                    success: false
                });
            } else {
                req.user = decode;
                next();
            }
        });

    } catch (error) {
        return res.status(401).send({
            message: 'Authorization Error',
            success: false,
            error: error.message
        });
    }
};
