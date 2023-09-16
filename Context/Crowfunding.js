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
        amount: ethers.parseUnits(amount, 18), //or ethers.parseUnits
        deadline: new Date(deadline).getTime(),
      });

      await transaction.wait();
    } catch (error) {
      console.log("contract call failed", error);
    }
  };

  const getCampaigns = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    // const signer = await provider.getSigner(); //TODO: IS IT NEED HERE?
    // console.log("Account:", await signer.getAddress()); //TODO: IS IT NEED HERE?
    const contract = fetchContract(provider);

    const campaigns = await contract.getCampaigns();

    const parserCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
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
    const filterCampaigns = allCampaigns.filter((campaign) => campaign.owner === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

    const userData = filterCampaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
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
        donations: ethers.formatEther(donations[1][i].toString()),
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
    // console.log('heree');
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
