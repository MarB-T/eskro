import createError from 'http-errors';
import ContractModel from '../models/contractModel.js';
import UserModel from '../models/users.js';
import { validateContract } from '../utils/validation.js';

class ContractController {
    async createContract(req, res) {
        try {
          UserModel.findOne({ phoneNumber: req.body.secondParty })
          .then((secondParty) => {
            console.log(secondParty);
          });
          
          if (req.body.buyer) {
            buyer = req.payload.aud;
            seller = secondParty._id;
          } else {
            buyer = secondParty._id;
            seller = req.payload.aud;
          }
          const { price, deadline, description } = req.body;
          const contractDetails = { description, price, deadline, buyer, seller };
          const { error, value: validatedContract } = validateContract(contractDetails);
          if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }
          const newContract = await ContractModel.create(validatedContract);
          console.log(newContract);
          res.status(201).json(newContract);
        } catch (err) {
        res.status(500).json({ Message: err.message });
        }
    }
    
    async getContract(req, res) {
        try {
        const contract = await ContractModel.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        res.status(200).json(contract);
        } catch (err) {
        res.status(500).json({ message: err.message });
        }
    }
}

export default ContractController;