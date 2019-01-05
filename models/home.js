const api = require('./api')

module.exports.getSlider = () => {
    return api.get('/settings/home_slides')
        .then(res => res.data)
        
        .catch(err => Promise.reject(err))
}
