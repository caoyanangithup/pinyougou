const config = require('./config')
module.exports.base = (req,res,next)=>{
    res.locals.site = config.site
    next()
}