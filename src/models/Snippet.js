const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  // This creates a direct link to a document in the 'User' collection.
  // It's how we know which user owns this snippet.
  user: {
    type: mongoose.Schema.Types.ObjectId, // The type is a special MongoDB Object ID.
    required: true,
    ref: 'User' // This tells Mongoose the ID refers to the 'User' model.
  },
  title: {
    type: String,
    required: [true, 'Please add a title'], // You can add custom error messages.
    trim: true // trim: true automatically removes any whitespace from the start and end.
  },
  language: {
    type: String,
    required: [true, 'Please specify a language'],
    // 'enum' restricts this field to only the values in the array.
    enum: ['javascript', 'python', 'c', 'text']
  },
  code: {
    type: String,
    required: [true, 'Please add some code']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields.
});

module.exports = mongoose.model('Snippet', SnippetSchema);
