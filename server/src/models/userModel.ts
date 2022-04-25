import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
    expirationDate: { type: Date, required: true },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, unique: true, dropDups: true },
    code: { type: String },
    refreshTokens: [refreshTokenSchema],
  },
  {
    timestamps: true,
  }
)

const userModel = mongoose.model('User', userSchema)

export default userModel
