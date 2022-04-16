import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, unique: true, dropDups: true },
    code: { type: String },
    refreshToken: { type: String, default: null },
    confirmed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const userModel = mongoose.model('User', userSchema)

export default userModel
