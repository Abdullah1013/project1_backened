const Joi = require('joi');
const {validationError} = require('joi');
const errorHandler = (error ,req,res,next)=>{
let status = 500;
let data = {
    message : 'Internal server error'
}
if (error instanceof Joi.ValidationError) {
    status = 400;  // Validation errors should typically result in a 400 status
    data.message = error.details[0].message;  // Extract the error message
    return res.status(status).json(data);
}

if (error.status) {
    status = error.status;
}
if (error.message) {
    data.message = error.message;
}
return res.status(status).json(data);
}

module.exports = errorHandler;