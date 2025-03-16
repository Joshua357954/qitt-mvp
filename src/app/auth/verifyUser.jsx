"use client"
import React, { useState } from 'react';
import { FcGoogle as Google } from "react-icons/fc";
import PageNav from '../../components/PageNav.jsx'
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';

const securityQuestionOptions = [
    { value: 'fathersName', label: 'What is your Father\'s maiden name?' },
    { value: 'mothersName', label: 'What is your Mother\'s maiden name?' },
    { value: 'nextofkinName', label: 'What is your Next of Kin\'s maiden name?' },
];

 

const EmailComponent = ({ email }) => {
    const [username, domain] = email.split('@');
    const numAsterisks = Math.max(Math.floor(username.length / 2), 3);
    const hiddenUsername = username.slice(0, numAsterisks) + '*'.repeat(username.length - numAsterisks);
    const hiddenEmail = `${hiddenUsername}@${domain}`;
  
    return (
      <span className='underline font-medium text-[#6962AD] mx-2 underline-offset-4'>{hiddenEmail}</span>
    );
  }

// #6C22A6
// #6962AD
// #83C0C1
// #96E9C6

const VerifyUser = ({ className }) => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [answer,setAnswer]  = useState("")

    const handleSelectChange = (selectedOption) => {
      setSelectedOption(selectedOption);
      
    };
    const { id } = useParams()
    const apiUrl = 'http://localhost:400'

    // check if there is no id (then thats fraudulent)

    const completeVerification = () => {
        console.log("Hello")
        alert(JSON.stringify(selectedOption))
        // axios.post(`${apiUrl}/verify/${id}`,{[selectedOption.value]:answer})
        //id,{value:answer}
    }


    return (
       <section className='w-full h-screen '>
       	<section className='flex flex-col gap-14 w-full sm:w-[60%] h-full items-center justify-center bg-gray-100 mx-auto p-3 shadow-lg  '>
             <div className='w-full flex flex-col items-center'>
                <PageNav route="   "/>
                <h2 className='text-4xl font-black mb-3 text-gray-900'>Confirm Your Identity</h2>
                <p className='text-md font-light '>This is to enhance account security and protect your information, <br />An OTP has been sent to 
                <EmailComponent email={'Csfun1000000@gmail.com'}/></p>
            </div>

            <div className='flex flex-col w-full gap-5 px-[20%] items-center'>
                <Select
                    defaultValue={securityQuestionOptions[0]}
                    options={securityQuestionOptions}
                    onChange={handleSelectChange}
                    className='w-full'
                />
                <div className='flex w-full'>
                    <input value={answer} onChange={({target})=> setAnswer(target.value) } className='px-3 text-md w-[70%] rounded-tr-none rounded-bl-none'/>
                    <button onClick={completeVerification} className='bg-[#6C22A6] font-bold text-gray-50 rounded-tl-none rounded-bl-none'>Proceed</button>
                </div>
                
                {/* <button className='bg-[#6C22A6] border-2 py-4 w-full text-gray-100 font-bold border-gray-100'>Proceed </button> */}
            </div>

            <div className='w-full flex justify-center flex-col items-center gap-10'>
                <div className='flex items-center'>
                    <div className='h-[2px] w-40 bg-gray-400 text-gray-100'></div>
                    <p className='mx-2'> or continue with </p>
                    <div className='h-[2px] w-40 bg-gray-400 text-gray-100'></div>
                </div>
               <div className="w-[60%] text-sm  flex gap-3 rounded-[4px] text-gray-800 active:text-gray-800 hover:text-gray-900 justify-center font-bold items-center py-4 hover:bg-  border-2 border-[#6962AD]">
                    <Google className='text-2xl'/> Sign In with Google
                </div>
               
            </div>
        </section>
       </section>

    );
};


export default VerifyUser;
