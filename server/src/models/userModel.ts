import mongoose from 'mongoose'

/*export interface UserValues {
  email: string
  code: string | null
  confirmed: boolean
  createdAt: Date
  updatedAt: Date
}*/

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, unique: true, dropDups: true },
    code: { type: String },
    confirmed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const userModel = mongoose.model('User', userSchema)

export default userModel
