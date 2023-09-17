'use client'
import React from "react";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
const ethers = require("ethers")

import { CrowFundingABI, CrowFundingAddress } from "./contants";

const fetchContract = (signerOrProvider) => {
  return new ethers.Contract(CrowFundingAddress, CrowFundingABI, signerOrProvider);
};

export const CrowFundingContext = React.createContext();
export const CrowFundingProvider = ({ children }) => {
  const titleData = "CF Contract";
  const [currentAccount, setCurrentAccount] = useState("");

  const createCampaign = async (campaign) => {
    const { title, description, amount, deadline } = campaign;
    const provider = await new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);

    console.log(currentAccount);

    try {
      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        ethers.parseUnits(amount, 18),
        new Date(deadline).getTime(),
      );      
      await transaction.wait();
    } catch (error) {
      console.log("contract call failed", error);
    }
  };

  const getCampaigns = async () => {
    const provider = await new ethers.BrowserProvider(window.ethereum);
    const contract = fetchContract(provider);

    const campaigns = await contract.getCampaigns();

    const parserCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatEther(campaign.target.toString()),
      deadline: Number(campaign.deadline),
      amountCollected: ethers.formatEther(campaign.amountCollected.toString()),
      pId: i,
    }));

    return parserCampaigns;
  };

  const getUserCampaigns = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = fetchContract(provider);

    const allCampaigns = await contract.getCampaigns();

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    const currentUser = accounts[0];
    const filterCampaigns = allCampaigns.filter((campaign) => campaign.owner.toUpperCase() === currentUser.toUpperCase());

    const userData = filterCampaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatEther(campaign.target.toString()),
      deadline: campaign.deadline, //TODO: TO NUMBER?
      amountCollected: ethers.formatEther(campaign.amountCollected.toString()),
      pId: i,
    }));

    return userData;
  };

  const donate = async (pId, amount) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);

    const campaignData = await contract.donateCampaign(pId, { value: ethers.parseEther(amount) });
    await campaignData.wait();
    location.reload();

    return campaignData;
  };

  const getDonations = async (pId) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = fetchContract(provider);

    const donation = await contract.getDonators(pId);
    const numberOfDonations = donation[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donation[0][i],
        donations: ethers.formatEther(donation[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  //CHECKERS IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return setOpenError(true), setError("Install Metamask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No account fund");
      }
    } catch (error) {
      console.log("something wrong when connection wallet", error);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  //CONNECT WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("Install Metamask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("something wrong when connection wallet", error);
    }
  };

  return (
    <CrowFundingContext.Provider
      value={{ titleData, currentAccount, createCampaign, getCampaigns, getUserCampaigns, donate, getDonations, connectWallet }}
    >
      {children}
    </CrowFundingContext.Provider>
  );

};
