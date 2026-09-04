import { Schema, model } from 'mongoose'

interface RefreshToken {
  // hashes, never the tokens themselves
  refreshToken: string
  previousRefreshToken: string | null
  rotatedAt: Date | null
  expirationDate: Date
}

interface User {
  email: string
  code: string | null
  refreshTokens: RefreshToken[]
  // timestamps
  createdAt: number
  updatedAt: number
}

const refreshTokenSchema = new Schema<RefreshToken>(
  {
    refreshToken: { type: String, required: true, index: true },
    previousRefreshToken: { type: String, default: null },
    rotatedAt: { type: Date, default: null },
    expirationDate: { type: Date, required: true },
  },
  { _id: false },
)

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    code: { type: String },
    refreshTokens: [refreshTokenSchema],
  },
  { timestamps: true },
)

const userModel = model('User', userSchema)

export default userModel
