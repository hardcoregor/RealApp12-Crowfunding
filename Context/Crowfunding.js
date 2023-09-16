import React, {useState, useEffect} from 'react';
import Web3Modal from 'web3modal';
import {ethers} from 'ethers';

import { CrowFundingABI, CrowFundingAddress } from './contants';

const fetchContract = (signerOrProvider) => {
  return new ethers.Contract(CrowFundingAddress, CrowFundingABI, signerOrProvider);
}

export const CrowFundingContext = React.createContext();
export const CrowFundingProvider = ({children}) => {
  const titleData = "CF Contract";
  const [currentAccount, setCurrentAccount] = useState("");

  const createCampaign = async(campaign) => {
    const {title, description, amount, deadline} = campaign;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    console.log(currentAccount);

    try {
      const transaction = await contract.createCampaign({
        currentAccount, 
        title,
        description,
        ethers.utils.parseUnits(amount, 18),
        new Date(deadline).getTime()
      });

      await transaction.wait();
    } catch (error) {
      console.log("contract call failed", error);
    }
  }
}