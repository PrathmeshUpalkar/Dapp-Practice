import './App.css';
import { useState,useEffect } from 'react';
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import {loadContract} from "./utils/load-contract";
import Admin from './Components/Admin';

function App() {
 
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract:null,
  });
  const [account, setAccount] = useState(null);
  const [amount ,setAmount] = useState(null);
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
      setAccount(accounts[0]);
      const etherValue = await web3Api.web3.eth.getBalance(accounts[0])
      const balance = Web3.utils.fromWei(etherValue, 'ether');
      setBalance(balance)
      
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3,reload]); 
 
  const Tranfer =async ()=>{
      
    const {web3,contract}=web3Api;
    await contract.transfer({
      from:account,
      value:web3.utils.toWei(amount,"ether")
    })
    // setAmount(amount);
    reloadEffect();
  }
  
  const withdrowFund =async ()=>{
      
    const {web3,contract}=web3Api;
    const withdrowAmt= web3.utils.toWei(amount,"ether");
    await contract.withdrow(withdrowAmt,{
      from:account,
    });
    reloadEffect();
  }
 
  return (
    <>

      <div className="mt-5 card text-center">
        <div className="card-body">
          <h5 className="card-title">Balance: {accBalance} ETH</h5>
          <p>Account Balance :{balance}</p>


          <p>Account No :{account ? account :"please install metamask"}</p>
          Ammount: &nbsp; <input type="text" name="Date" value={amount} onChange={(e)=>setAmount(e.target.value)} className="mt-3 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Enter Wender Ammount" /><br></br><br></br>

          {/* <button onClick={meta} className="btn btn-success">Connect to metamask</button> &nbsp;&nbsp; */}
          <button onClick={Tranfer} className="btn btn-success">transfer</button>&nbsp;&nbsp;

          <button onClick={withdrowFund} className="btn btn-primary">Withdrow</button>


        </div>

      </div>

      <Admin/>

    </>
  );
}












export default App;
