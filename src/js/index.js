import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'

web3.setProvider(new web3.providers.HttpProvider());

const address = "0x6945f2889076dbc9e0f5586381d2b7cbb88c3193"
var json = require("./../../build/contracts/First.json");
var contract = require("truffle-contract");
const abi = contract(json);
web3.eth.defaultAccount = web3.eth.accounts[0];


class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            vendor: web3.eth.defaultAccount,
            isASeller: "a",
            prodNameInput: "",
            prodNumInput: "",
            prodQuantInput: "",
        }
        if(typeof web3 != 'undefined'){
            console.log("Using web3 detected from external source like Metamask")
            this.web3 = new Web3(web3.currentProvider)
        }else{
            console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
        }
        abi.setProvider(web3.currentProvider);
        this.state.ContractInstance = abi.at(address);
        // var productListed = this.state.ContractInstance.ProductListed({fromBlock: 0, toBlock: 'latest'});
        // var productBought = this.state.ContractInstance.ProductBought({fromBlock: 0, toBlock: 'latest'});
        // var productRemoved = this.state.ContractInstance.ProductRemoved({fromBlock: 0, toBlock: 'latest'});
        // var productPauseToggled = this.state.ContractInstance.ProductPauseToggled({fromBlock: 0, toBlock: 'latest'});
        // var newSeller = this.state.ContractInstance.NewSeller({fromBlock: 0, toBlock: 'latest'});
        var events = this.state.ContractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
        //console.log("1");
        events.watch(function(error, result){
            //console.log("1.1");
            if (!error)
            {
                console.log(result.args);
                if (typeof result.args._seller != "undefined"){
                    console.log("newSeller works?");
                }else if (typeof result.args.seller != 'undefined' && typeof result.args.price != 'undefined' && typeof result.args.prodID != 'undefined' && typeof result.args.buyer == 'undefined'){
                    console.log("product listed?");
                }else if (typeof result.args.seller != 'undefined' && typeof result.args.buyer != 'undefined' && result.args.prodID != 'undefined' && result.args.price != 'undefined'){
                    console.log("product bought?");
                }else if (typeof result.args.seller != 'undefined' && typeof result.args.prodID != 'undefined' && result.args.buyer == 'undefined' && result.args.pauseStatus == 'undefined'){
                    console.log("product removed?");
                }else if (typeof result.args.seller != 'undefined' && typeof result.args.prodID != 'undefined' && result.args.buyer == 'undefined' && result.args.pauseStatus != 'undefined'){
                    console.log("product paused?");
                }
            } else {
                console.log(error);
                console.log("something doesnt work?")
                return;
            }
        });
        //console.log("2");
        // productPauseToggled.watch(function(error, result){
        //     if (!error)
        //     {
        //         console.log(result.args);
        //         console.log("productPauseToggled works?");
        //     } else {
        //         console.log(error);
        //         console.log("productPauseToggled doesn't work?")
        //         return;
        //     }
        // });
        // productRemoved.watch(function(error, result){
        //     if (!error)
        //     {
        //         console.log(result.args);
        //         console.log("productRemoved works?");
        //     } else {
        //         console.log(error);
        //         console.log("productRemoved doesn't work?")
        //         return;
        //     }
        // });
        // productBought.watch(function(error, result){
        //     if (!error)
        //     {
        //         console.log(result.args);
        //         console.log("productBought works?");
        //     } else {
        //         console.log(error);
        //         console.log("productBought doesn't work?")
        //         return;
        //     }
        // });
        // productListed.watch(function(error, result){
        //     if (!error)
        //     {
        //         console.log(result.args);
        //         console.log("productListed works?");
        //     } else {
        //         console.log(error);
        //         console.log("productListed doesn't work?")
        //         return;
        //     }
        // });


        //console.log("3")
        this.buySeller = this.buySeller.bind(this)
        this.listProd = this.listProd.bind(this)
        this.remSeller = this.remSeller.bind(this)
        this.handleListProdNameChange = this.handleListProdNameChange.bind(this);
        this.handleListProdNumChange = this.handleListProdNumChange.bind(this);
        this.handleListProdQuantChange = this.handleListProdQuantChange.bind(this);
        this.handleListProdSubmit = this.handleListProdSubmit.bind(this);
    }

    handleListProdNameChange(event){
        console.log("namechange");
        this.setState({
            prodNameInput: event.target.value
        });
    }
    handleListProdNumChange(event){
        this.setState({
            prodNumInput: event.target.value
        });
    }
    handleListProdQuantChange(event){
        this.setState({
            prodQuantInput: event.target.value
        });
    }
    handleListProdSubmit(event){
        alert('A product was listed named : ' + this.state.prodNameInput + ' at a price of ' + this.state.prodNumInput + ' with ' + this.state.prodQuantInput + ' listings');
        event.preventDefault();
        this.listProd()
    }


    buySeller(){
        this.state.ContractInstance.becomeSeller(web3.eth.defaultAccount, {
            gas: 1000000,
            from: web3.eth.defaultAccount,
            value: web3.toWei(1.0, 'ether'),
        }).then(function(r) {
            console.log("Bought Seller successfully!")
        })
    };
    listProd(){
        this.state.ContractInstance.listProduct(web3.eth.defaultAccount, this.state.prodNumInput, this.state.prodQuantInput, {
            gas: 1000000,
            from: web3.eth.defaultAccount,
            value: web3.toWei(50, 'finney')
        }).then(function(r) {
            console.log("Listed Product successfully!")
        })
    }
    remSeller(){
        this.state.ContractInstance.removeSeller(web3.eth.defaultAccount, {
            gas: 1000000,
            from: web3.eth.defaultAccount
        }).then(function(r) {
            console.log("Removed Seller successfully!")
        })
    }
    render(){
        return (
            <div className="main-container">
            <h1>The mrktPlace</h1>
            <p>{this.state.isASeller}</p>
            <button onClick={this.buySeller}>Become a Seller!</button>
            <button onClick={this.remSeller}>Remove a Seller!</button>
            <form onSubmit={this.handleListProdSubmit}>
            <h2>List a Product!</h2>
            <label>
            Product Name
            <input type="text" value={this.state.prodNameInput} onChange={this.handleListProdNameChange}/>
            </label>
            <label>
            Price
            <input type="number" value={this.state.prodNumInput} onChange={this.handleListProdNumChange}/>
            </label>
            <label>
            Quantity
            <input type="number"value={this.state.prodQuantInput} onChange={this.handleListProdQuantChange}/>
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
