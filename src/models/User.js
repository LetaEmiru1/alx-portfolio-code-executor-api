// Import mongoose, our tool for working with MongoDB.
const mongoose = require('mongoose');

// Define the schema for the User collection. A schema is a blueprint for the data.
const UserSchema = new mongoose.Schema({
  // The 'username' field.
  username: {
    type: String,       // It must be a string.
    required: true,     // It is a required field.
    unique: true        // Each username must be unique in the database.
  },
  // The 'email' field.
  email: {
    type: String,
    required: true,
    unique: true
  },
  // The 'password' field.
  password: {
    type: String,
    required: true
    // Note: We will NOT make the password unique. Two users might choose the same simple password.
  }
}, {
  // Options for the schema.
  // 'timestamps: true' automatically adds 'createdAt' and 'updatedAt' fields.
  // This is very useful for tracking when documents are created or modified.
  timestamps: true
});

// Create the 'User' model from the schema and export it.
// Mongoose will create a collection named 'users' (plural and lowercase) in MongoDB.
// We can now use this 'User' object to create, read, update, and delete users in our database.
module.exports = mongoose.model('User', UserSchema);
