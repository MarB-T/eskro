import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
    description: { type: String, required: true },
    price: { type: Number, required: true },
    conditionsMet: { type: Boolean, required: true, default: false},
    deadline: { type: Date, required: true },
    status: { type: String, required: true, default: 'pending'},
    paidAmount: { type: Number, required: true, default: 0 },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ContractModel = mongoose.model('contracts', contractSchema);

export default ContractModel;
