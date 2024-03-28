import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true},
  password: { type: String, minlength: 6, required: true },
  buyingContracts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'contracts' }],
  sellingContracts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'contracts' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('users', userSchema);

export default UserModel;