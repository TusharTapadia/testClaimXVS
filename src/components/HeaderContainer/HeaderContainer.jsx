import React, { useContext } from 'react'
import "./HeaderContainer.css"
import AddLogo from "../../assets/toggeleLogo/create-portfolio-button@3x.png"
import Logo from "../../assets/toggeleLogo/mobileLogo.png"
import GlobalContext from '../../context/GlobalContext/GlobalContext'

const HeaderContainer = () => {
  const { 
    totalUserBalanceInDollar
} = useContext(GlobalContext)
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formattedToday = dd + '/' + mm + '/' + yyyy;

  return (
    <>
    <div className='HeaderContainer'>
    <h2 className="title fn-lg text-center">Dashboard</h2>
    <a className='create-portfolio-button ' href='https://docs.google.com/forms/d/e/1FAIpQLScIFfe40DLT3x14FECK03tk03d3BYpPXMH-OJXanltEiyN2cw/viewform' target="_blank">
        <img src={AddLogo} alt="" />
    {/* Create New Portfolio */}
    </a>
    </div>
    <div className='mobileHeader'>
    <div className="left">
      <img src={Logo} alt="" />
      <p className='todayDate'>{`TODAY  ${formattedToday}`}</p>
    </div>
      <div className="left">
        <p>Value (BUSD)</p>
        <p>{totalUserBalanceInDollar}$</p>
      </div>
      <div className="right">
        <p>Return</p>
        <p>-</p>  
      </div>
    </div>
    </>
  )
}

export default HeaderContainer