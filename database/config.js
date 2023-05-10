const mongoose = require('mongoose');


const dbConnection = async() =>{

    try {
       
       mongoose.set('strictQuery', true);
       await mongoose.connect(process.env.MONGODB_CNN, {
        useNewUrlParser:true,
        useUnifiedTopology:true
       });
       console.log('Base de datos conectada correctamente');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar base de datos Mongo.')
    }

}

module.exports = {
    dbConnection
}