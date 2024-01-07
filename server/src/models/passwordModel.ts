import { Schema, model } from 'mongoose'

interface Password {
  addedBy: Schema.Types.ObjectId
  name: string
  encryptedPassword: string
  iv: string
  // timestamps
  createdAt: number
  updatedAt: number
}

const passwordSchema = new Schema<Password>(
  {
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    iv: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const passwordModel = model('Password', passwordSchema)

export default passwordModel
