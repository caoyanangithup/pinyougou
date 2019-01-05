const homeModel = require('../models/home')


module.exports.index = (req,res,next)=>{
    homeModel.getSlider()
        .then(data => {
            res.locals.slider = data
            // res.send(data)
            res.render('home.art')
        })
        .catch(err => next(err))
}