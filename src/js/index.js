import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'

web3.setProvider(new web3.providers.HttpProvider());

const address = "0xb29793080eacd1b5523eb4c5e8f3197a46704c49"
var json = require("./../../build/contracts/First.json");
var contract = require("truffle-contract");
const abi = contract(json);
web3.eth.defaultAccount = web3.eth.accounts[0];


class App extends React.Component {
   constructor(props){
      super(props)
      this.state = {
         // lastWinner: 0,
         // numberOfBets: 0,
         // minimumBet: 0,
         // totalBet: 0,
         // maxAmountOfBets: 0,
      }
      if(typeof web3 != 'undefined'){
               console.log("Using web3 detected from external source like Metamask")
               this.web3 = new Web3(web3.currentProvider)
            }else{
               console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
               this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
            }
      // var json = require("./../../build/contracts/First.json");
      // var contract = require("truffle-contract");
      // const MyContract = contract(json);
      abi.setProvider(web3.currentProvider);
      this.state.ContractInstance = abi.at(address);
      this.buySeller = this.buySeller.bind(this)
      //this.state.ContractInstance = MyContract.at("0x8c83dd2ac9943d325ec9c6c43509c068176c9785");

      //MyContract.deployed().then(i => this.state.ContractInstance = i);
  }

/*const MyContract = web3.eth.contract([
//   {
//     "constant": false,
//     "inputs": [
//       {
//         "name": "_seller",
//         "type": "address"
//       }
//     ],
//     "name": "becomeSeller",
//     "outputs": [],
//     "payable": true,
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "constant": false,
//     "inputs": [
//       {
//         "name": "_vendor",
//         "type": "address"
//       },
//       {
//         "name": "_prodID",
//         "type": "uint256"
//       }
//     ],
//     "name": "removeProduct",
//     "outputs": [],
//     "payable": false,
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "constant": false,
//     "inputs": [
//       {
//         "name": "_vendor",
//         "type": "address"
//       },
//       {
//         "name": "_prodID",
//         "type": "uint256"
//       }
//     ],
//     "name": "pauseProductToggle",
//     "outputs": [],
//     "payable": false,
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "constant": true,
//     "inputs": [],
//     "name": "owner",
//     "outputs": [
//       {
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "payable": false,
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "constant": false,
//     "inputs": [
//       {
//         "name": "_vendor",
//         "type": "address"
//       },
//       {
//         "name": "_price",
//         "type": "uint256"
//       },
//       {
//         "name": "_quantity",
//         "type": "uint24"
//       }
//     ],
//     "name": "listProduct",
//     "outputs": [],
//     "payable": true,
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "constant": false,
//     "inputs": [
//       {
//         "name": "newOwner",
//         "type": "address"
//       }
//     ],
//     "name": "transferOwnership",
//     "outputs": [],
//     "payable": false,
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "payable": false,
//     "stateMutability": "nonpayable",
//     "type": "constructor"
//   },
//   {
//     "payable": true,
//     "stateMutability": "payable",
//     "type": "fallback"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "name": "seller",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "name": "price",
//         "type": "uint256"
//       },
//       {
//         "indexed": true,
//         "name": "prodID",
//         "type": "uint256"
//       }
//     ],
//     "name": "ProductListed",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "name": "seller",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "name": "buyer",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "name": "prodID",
//         "type": "uint256"
//       },
//       {
//         "indexed": false,
//         "name": "price",
//         "type": "uint256"
//       }
//     ],
//     "name": "ProductBought",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "name": "seller",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "name": "prodID",
//         "type": "uint256"
//       }
//     ],
//     "name": "ProductRemoved",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "name": "seller",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "name": "pauseStatus",
//         "type": "bool"
//       },
//       {
//         "indexed": true,
//         "name": "prodID",
//         "type": "uint256"
//       }
//     ],
//     "name": "ProductPauseToggled",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "name": "_seller",
//         "type": "address"
//       }
//     ],
//     "name": "NewSeller",
//     "type": "event"
//   }
// ])
       this.state.ContractInstance = MyContract.at("0x7a684de06f473636e03e2d951c78d190eeecb411")
   }*/
/*componentDidMount(){
      this.updateState()
      this.setupListeners()
setInterval(this.updateState.bind(this), 10e3)
   }
updateState(){
      this.state.ContractInstance.minimumBet((err, result) => {
         if(result != null){
            this.setState({
               minimumBet: parseFloat(web3.fromWei(result, 'ether'))
            })
         }
      })
      // this.state.ContractInstance.totalBet((err, result) => {
      //    if(result != null){
      //       this.setState({
      //          totalBet: parseFloat(web3.fromWei(result, 'ether'))
      //       })
      //    }
      // })
      // this.state.ContractInstance.numberOfBets((err, result) => {
      //    if(result != null){
      //       this.setState({
      //          numberOfBets: parseInt(result)
      //       })
      //    }
      // })
      // this.state.ContractInstance.maxAmountOfBets((err, result) => {
      //    if(result != null){
      //       this.setState({
      //          maxAmountOfBets: parseInt(result)
      //       })
      //    }
      // })
  }*/
// Listen for events and executes the voteNumber method
   setupListeners(){
      let liNodes = this.refs.numbers.querySelectorAll('li')
      liNodes.forEach(number => {
         number.addEventListener('click', event => {
            event.target.className = 'number-selected'
            this.buySeller();
         })
      })
   }
// voteNumber(number, cb){
//       let bet = this.refs['ether-bet'].value
// if(!bet) bet = 0.1
// if(parseFloat(bet) < this.state.minimumBet){
//          alert('You must bet more than the minimum')
//          cb()
//       } else {
//          this.state.ContractInstance.bet(number, {
//             gas: 300000,
//             from: web3.eth.accounts[0],
//             value: web3.toWei(bet, 'ether')
//          }, (err, result) => {
//             cb()
//          })
//       }
//    }
   buySeller(){
       this.state.ContractInstance.becomeSeller(web3.eth.accounts[0], {
           gas: 1000000,
           from: web3.eth.accounts[0],
           value: web3.toWei(1.0, 'ether')
       })
   }
   listProd(_price, _quantity){
       this.state.ContractInstance.listProduct(web3.eth.accounts[0], _price, _quantity, {
           gas: 1000000,
           from: web3.eth.accounts[0],
           value: web3.toWei(50, 'finney')
       })
   }
render(){
      return (
         <div className="main-container">
            <h1>The mrktPlace</h1>
               <button onClick={this.buySeller}>Become a Seller!</button>
               <form>
               <h2>List a Product!</h2>
               <label>
                   Product Name
                   <input type="text" name="name" />
               </label>
                <label>
                    Price
                    <input type="number" name="_price" />
                </label>
                <label>
                    Quantity
                    <input type="number" name="_quantity" />
                </label>
                    <input type="submit" value="Submit" />
                </form>
         </div>
      )
   }
}
ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
