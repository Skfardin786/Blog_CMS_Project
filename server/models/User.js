/**
 * User Model
 * ----------
 * Defines the schema for user documents stored in MongoDB.
 *
 * Key concepts demonstrated:
 *   - Mongoose schema validation (required, unique, minlength)
 *   - Pre-save hooks (middleware that runs before saving)
 *   - Password hashing with bcrypt (never store plain-text passwords!)
 *   - Instance methods on Mongoose documents
 *   - select: false to exclude sensitive fields from queries by default
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // Removes leading/trailing whitespace
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Creates a unique index in MongoDB
      lowercase: true, // Converts to lowercase before saving
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // IMPORTANT: Excludes password from query results by default.
      //               You must explicitly ask for it with .select('+password')
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * Pre-save Hook — Password Hashing
 * ---------------------------------
 * This runs BEFORE every .save() call on a User document.
 * We only hash the password if it has been modified (or is new),
 * so updating a user's name won't re-hash the existing password.
 *
 * bcrypt.hash(password, saltRounds):
 *   - saltRounds (10) = how many times the hashing algorithm runs.
 *     Higher = more secure but slower. 10 is a good default.
 */
userSchema.pre('save', async function (next) {
  // `this` refers to the document being saved
  if (!this.isModified('password')) {
    return next(); // Skip hashing if password hasn't changed
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance Method — Compare Password
 * -----------------------------------
 * Compares a plain-text candidate password with the stored hashed password.
 * bcrypt.compare handles the hashing internally, so we never need to
 * decode or decrypt the stored password.
 *
 * Usage in controller:
 *   const isMatch = await user.comparePassword(req.body.password);
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
