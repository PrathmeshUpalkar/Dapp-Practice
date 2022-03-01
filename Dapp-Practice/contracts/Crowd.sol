// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Crowd{
    uint public noOfContributers;

    mapping(uint=>address) public contributers;
    address public reciver;   
    receive() external payable{}

    function transfer() external payable{
        contributers[noOfContributers]=msg.sender;
    }

    function withdrow(uint withdrowAmt) external{

        require(withdrowAmt >= 2000000000000000000 ,"minimum 2 ether transfer");
            payable(msg.sender).transfer(withdrowAmt);
    }

     function TransferMoney(address payable rec ,uint amt) external  {
        reciver = rec;
        amt = amt*1000000000000000000;
        rec.transfer(amt);
        contributers[noOfContributers]=msg.sender;



   }
}