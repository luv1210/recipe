const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://luv1210:luv1210@cluster0.xxws7ec.mongodb.net/recipe-app');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
