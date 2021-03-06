const jwt = require('jsonwebtoken');
const db = require('../models');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = db.user;

exports.protect = asyncHandler(async (req, res, next) => {
    
    let token;

    /*if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }*/

    if (req.cookies.token) {
        token = req.cookies.token
     }

    if(!token) {
        return next(new ErrorResponse('Not authorize to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findByPk(decoded.id);
        next();
    }
    
    catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

})

// Access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse('User role is not authorized', 403));
        }
        next();
    }
}