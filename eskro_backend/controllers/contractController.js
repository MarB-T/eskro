import createError from 'http-errors';
import ContractModel from '../models/contractModel.js';
import UserModel from '../models/users.js';
import { validateContract } from '../utils/validation.js';
import axios from 'axios';
// import { mpesaSTK, generateToken } from '../utils/mpesaSTK.js';

class ContractController {
  async createContract(req, res) {
    try {
      const { price, deadline, description } = req.body;
      const secondParty = await UserModel.findOne({ phoneNumber: req.body.secondParty });
      if (!secondParty) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const buyerId = req.body.buyer ? req.payload.aud : secondParty._id;
      const sellerId = req.body.buyer ? secondParty._id : req.payload.aud;
  
      const contractDetails = { description, price, deadline, buyer: buyerId.toString(), seller: sellerId.toString() };
      const { error, value: validatedContract } = validateContract(contractDetails);
  
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const newContract = await ContractModel.create(validatedContract);
      console.log(newContract);

    // Update buyer's buyingContracts
      await UserModel.findByIdAndUpdate(
        buyerId,
        { $push: { buyingContracts: newContract._id } },
        { new: true } // Return the updated document
      );

      // Update seller's sellingContracts
      await UserModel.findByIdAndUpdate(
        sellerId,
        { $push: { sellingContracts: newContract._id } },
        { new: true } // Return the updated document
      );      

      res.status(201).json(newContract);
    } catch (err) {
      console.error(err); // Log the full error for debugging
      res.status(500).json({ message: 'Error creating contract' });
    }
  }
    // async createContract(req, res) {
    //     try {
    //       UserModel.findOne({ phoneNumber: req.body.secondParty })
    //       .then((secondParty) => {
    //         console.log(secondParty);
    //         if (req.body.buyer) {
    //           buyerId = req.payload.aud;
    //           sellerId = secondParty._id;
    //         } else {
    //           buyerId = secondParty._id;
    //           sellerId = req.payload.aud;
    //         }
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         return res.status(404).json({ message: 'User not found' });
    //       });
          
          
    //       const { price, deadline, description } = req.body;
    //       const contractDetails = { description, price, deadline, buyerId, sellerId };
    //       const { error, value: validatedContract } = validateContract(contractDetails);
    //       if (error) {
    //         return res.status(400).json({ message: error.details[0].message });
    //       }
    //       const newContract = await ContractModel.create(validatedContract);
    //       console.log(newContract);
    //       res.status(201).json(newContract);
    //     } catch (err) {
    //     res.status(500).json({ Message: err.message });
    //     }
    // }
    
  async getContracts(req, res) {
      try {
        const user = await UserModel.findById(req.payload.aud);
        let contractIds = [];
        contractIds = req.body.buy ? contractIds.concat(user.buyingContracts) : contractIds.concat(user.sellingContracts);
        contractIds = contractIds.map(id => id.toString()); // Convert ObjectIds to strings (optional)
        const contracts = []; // Initialize empty array to store contracts

        for (let i = 0; i < contractIds.length; i++) {
          const contract = await ContractModel.findById(contractIds[i]);
          contracts.push(contract);
        }
        if (contracts.length === 0) {
          return res.status(404).json({ message: 'No contracts found' });
        }
        res.status(200).json(contracts);
      } catch (err) {
      res.status(500).json({ message: err.message });
      }
  }

  async updatePayment(req, res) {
    try {
      console.log(req.params.id);
      const contract = await ContractModel.findById(req.params.id);
      console.log(contract);
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
      if (contract.status !== 'pending') {
        return res.status(400).json({ message: 'Contract is not pending' });
      }
      // if (req.payload.aud !== contract.buyer) {
      //   return res.status(403).json({ message: 'You are not authorized to update this contract' });
      // }
      const updatedContract = await ContractModel.findByIdAndUpdate(
        req.params.id,
        { status: "paid",
        paidAmount: req.body.paidAmount,
        updatedAt: Date.now()},
        { new: true } // Return the updated document
      );
      res.status(200).json(updatedContract);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default ContractController;