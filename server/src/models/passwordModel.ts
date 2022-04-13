import mongoose, { ObjectId } from 'mongoose'

/*export interface PasswordValues {
  addedBy: ObjectId
  name: string
  encryption: string
  vi: string
  createdAt: Date
  updatedAt: Date
}*/

const passwordSchema = new mongoose.Schema(
  {
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    encryption: { type: String, required: true },
    vi: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const passwordModel = mongoose.model('Password', passwordSchema)

export default passwordModel
