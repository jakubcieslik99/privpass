import mongoose from 'mongoose'

const passwordSchema = new mongoose.Schema(
  {
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    iv: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const passwordModel = mongoose.model('Password', passwordSchema)

export default passwordModel
