import React from 'react'

import { useState,useEffect } from 'react';
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import {loadContract} from "../utils/load-contract";

const Admin = () => {

    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract:null,
      });
      const [account, setAccount] = useState(null);
      const [amount ,setAmount] = useState(null);
      const [add,setAdd] = useState(null);
      const [balance, setBalance] = useState(null);
      const [ accBalance ,setAccBalance]= useState(null);
      const [reload,shouldreload]=useState(null);
      const reloadEffect=()=>{shouldreload(!reload)}
    
    
      useEffect(() => {
        const loadProvider = async () => {
          const provider = await detectEthereumProvider();
          const contract= await loadContract("Crowd",provider);
    
          if (provider) {
            provider.request({ method: "eth_requestAccounts" });
            setWeb3Api({
              web3: new Web3(provider),
              provider,
              contract,
            });
          } else {
            console.error("Please install MetaMask!");
          }
        };
    
        loadProvider();
      }, []);
    
    
      useEffect(()=>{
        const loadBalance = async()=>{
          const {contract,web3}=web3Api;
          const Balance = await web3.eth.getBalance(contract.address);
          setAccBalance(web3.utils.fromWei(Balance,"ether"));
        }
        web3Api.contract && loadBalance()
      },[web3Api,reload])
    
    
      useEffect(() => {
        const getAccount = async () => {
          const accounts = await web3Api.web3.eth.getAccounts();
          console.log(accounts)
          setAccount(accounts[0]);
          const etherValue = await web3Api.web3.eth.getBalance(accounts[0])
          const balance = Web3.utils.fromWei(etherValue, 'ether');
          setBalance(balance)
          
        };
        web3Api.web3 && getAccount();
      }, [web3Api.web3,reload]); 
     

const transferAmt = async()=>{
            const {web3,contract}=web3Api;

                const transferAmt= web3.utils.toWei(amount,"ether");
                // const transferAdd= web3.utils.;

                await contract.TransferMoney(add,transferAmt,{
                  from:account,
                });
                reloadEffect();
    }

    



      const Tranfer =async ()=>{
          
        const {web3,contract}=web3Api;
        await contract.transfer({
          from:add,
          to:account,
          value:web3.utils.toWei(amount,"ether")
        })
        // setAmount(amount);
        reloadEffect();
      }


      
    //   const withdrowFund =async ()=>{
          
    //     const {web3,contract}=web3Api;
    //     const withdrowAmt= web3.utils.toWei(amount,"ether");
    //     await contract.withdrow(withdrowAmt,{
    //       from:account,
    //     });
    //     reloadEffect();
    //   }
     
  return (
    <>

<h4 className='mt-3 text-center ' >Contract Balance {accBalance}  </h4>
          <h6 className='mt-1 text-center'>Contract Address:<p className=""> 0x79706B0adeBEeBc3AdF8A410754714EE432b491b </p></h6>


          <div className='row mt-5'>
            <div className="mt-5 col-sm-6 mt-5 text-center">
              <div className='card'>
                <div className='card-body'>
                  <h4>Monthly Expenses</h4>

                  Ammount: <input type="text" name="Date" value={amount} onChange={(e)=>setAmount(e.target.value)} className="mt-3 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Enter Wender Ammount" /><br></br>
                  Wender Address:<input type="text" name="Date" value={add} onChange={(e)=>setAdd(e.target.value)} className="mt-3 px-4 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Enter Wender Adress" /><br></br>


                  <br></br><br></br><button className=' btn btn-success text-left'>Connect to Metamask</button>


                  &nbsp; &nbsp; &nbsp;<div onClick={transferAmt} className='btn btn-primary'>Send</div>

                </div>
                </div>
              </div>
            </div>

    </>
  )
}

export default Admin