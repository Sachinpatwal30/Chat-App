
const errorHandler = (err,req, res, next)=>{

    const errorStatus = err.status || 500;
    const errorMessage= err.message || "Oops something went wrong";

    res.status(errorStatus).json({
        succuss: false,
        errorStatus,
        errorMessage,
        stack: err.stack,
    })

}


module.exports = errorHandler;