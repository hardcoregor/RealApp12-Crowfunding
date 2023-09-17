'use client'

import React, { useEffect, useContext, useState } from "react";

import { CrowFundingContext } from "../Context/Crowfunding";
import { Hero, Card, PopUp } from "../Components";

const Page = () => {
  const {
    titleData,
    getCampaigns,
    createCampaign,
    donate,
    getUserCampaigns,
    getDonations
  } = useContext(CrowFundingContext);

  const [allCampaign, setAllCampaign] = useState();
  const [userCampaign, setUserCampaign] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCampaignsData = await getCampaigns();
        const userCampaignsData = await getUserCampaigns();
        
        setAllCampaign(getCampaignsData);
        setUserCampaign(userCampaignsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  return(
    <>
      <Hero titleData={titleData} createCampaign={createCampaign}/>
      <Card
        title="All listed Campaign"
        allCampaign={allCampaign}
        setOpenModal={setOpenModal}
        setDonate={setDonateCampaign}
      />

      <Card
        title="Your created Campaign"
        allCampaign={userCampaign}
        setOpenModal={setOpenModal}
        setDonate={setDonateCampaign}
      />

      {openModal && (
        <PopUp 
          setOpenModal={setOpenModal}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
    </>
  )
}

export default Page;