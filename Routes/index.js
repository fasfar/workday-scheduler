const userRoutes = require('./users');
const BookingRoutes = require('./Booking');


const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/', BookingRoutes);

  
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Not found' });
    });
  };
  
  module.exports = constructorMethod;