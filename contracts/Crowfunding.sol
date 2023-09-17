// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

contract Crowfunding {
  struct Campaign {
    address owner;
    string title;
    string description;
    uint256 target;
    uint256 deadline;
    uint amountCollected;
    address[] donators;
    uint256[] donations;
  }

  mapping(uint256 => Campaign) public campaigns;

  uint256 public numOfCampaigns;

  function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline) public returns(uint256) {
    Campaign storage campaign = campaigns[numOfCampaigns];

    require(_deadline >= block.timestamp, 'Deadline !>= block.timestamp');

    campaign.owner = _owner;
    campaign.title = _title;
    campaign.description = _description;
    campaign.target = _target;
    campaign.deadline = _deadline;

    numOfCampaigns++;

    return numOfCampaigns - 1;
  }

  function donateCampaign(uint256 _id) public payable {
    uint256 amount = msg.value;

    Campaign storage campaign = campaigns[_id];
    campaign.donators.push(msg.sender);
    campaign.donations.push(amount);

    (bool success, ) = payable(campaign.owner).call{value: amount}("");

    if(success) {
      campaign.amountCollected = campaign.amountCollected + amount;
    }
  }

  function getDonators(uint256 _id) view public returns(address[] memory, uint256[] memory){
    return (campaigns[_id].donators, campaigns[_id].donations);
  }

  function getCampaigns() public view returns(Campaign[] memory) {
    Campaign[] memory allCampaigns = new Campaign[](numOfCampaigns);

    for(uint i; i < numOfCampaigns; i++) {
      Campaign memory item = campaigns[i];

      allCampaigns[i] = item;
    }

    return allCampaigns;
  }
 }