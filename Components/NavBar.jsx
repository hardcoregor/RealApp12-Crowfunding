'use client'

import React, {useState, useContext} from 'react';

import { CrowFundingContext } from '@/Context/Crowfunding';
import { Logo, Menu } from '../Components/index';

const NavBar = () => {
  const { currentAccount, connectWallet } = useContext(CrowFundingContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuList = ["White Paper", "Project", "Donation", "Members"];

  return (
    <div class="backgroundMain">NavBar</div>
  )
}

export default NavBar