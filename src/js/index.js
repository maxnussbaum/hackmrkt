import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'
import TableRow from './components/tableRow.js';

web3.setProvider(new web3.providers.HttpProvider());

const address = "0x412d3097f1522cae6a505ead7caa1a3e614f20d0"
var json = require("./../../build/contracts/First.json");
var contract = require("truffle-contract");
const abi = contract(json);
web3.eth.defaultAccount = web3.eth.accounts[0];


class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            vendor: web3.eth.defaultAccount,
            prodNameInput: "",
            prodNumInput: "",
            prodQuantInput: "",
            sellerAddressArr: [],
            merch: {}
        };
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
        // var events = this.state.ContractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
        // events.watch(function(error, result){
        //     //console.log("1.1");
        //     if (!error)
        //     {
        //         console.log(result.args);
        //         if (typeof result.args._seller != "undefined"){
        //             console.log("newSeller works?");
        //             this.setState({
        //                 arr: arr.concat(result.args._seller)
        //             });
        //         }else if (typeof result.args.__seller != "undefined"){
        //             console.log("seller removed?");
        //         }else if (typeof result.args.seller != 'undefined' && typeof result.args.price != 'undefined' && typeof result.args.prodID != 'undefined' && typeof result.args.buyer == 'undefined'){
        //             console.log("product listed?");
        //         }else if (typeof result.args.seller != 'undefined' && typeof result.args.buyer != 'undefined' && result.args.prodID != 'undefined' && result.args.price != 'undefined'){
        //             console.log("product bought?");
        //         }else if (typeof result.args.seller != 'undefined' && typeof result.args.prodID != 'undefined' && result.args.buyer == 'undefined' && result.args.pauseStatus == 'undefined'){
        //             console.log("product removed?");
        //         }else if (typeof result.args.seller != 'undefined' && typeof result.args.prodID != 'undefined' && result.args.buyer == 'undefined' && result.args.pauseStatus != 'undefined'){
        //             console.log("product paused?");
        //         }
        //     } else {
        //         console.log(error);
        //         console.log("something doesnt work?")
        //         return;
        //     }
        // });
        // if (newwSeller != ""){
        //     var sellerAddress = this.state.sellerAddress.split();
        //     console.log("next");
        //     sellerAddress.push(newwSeller);
        //     this.setState({
        //         sellerAddress: sellerAddress
        //     });
        //     newwSeller = "";
        //     console.log(this.state.sellerAddress);
        // }else{
        //     console.log("other");
        // }
        this.buySeller = this.buySeller.bind(this)
        this.listProd = this.listProd.bind(this)
        this.remSeller = this.remSeller.bind(this)
        this.handleListProdNameChange = this.handleListProdNameChange.bind(this);
        this.handleListProdNumChange = this.handleListProdNumChange.bind(this);
        this.handleListProdQuantChange = this.handleListProdQuantChange.bind(this);
        this.handleListProdSubmit = this.handleListProdSubmit.bind(this);
        this.handleBuyNum = this.handleBuyNum.bind(this);
        // this.buyProd = this.buyProd.bind(this);
    }

    componentDidMount(){
        const events = this.state.ContractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
        events.watch((error, result) => {
            //console.log("1.1");
            if (!error)
            {
                console.log(result.args);
                if (typeof result.args._seller != "undefined"){
                    console.log("newSeller works?");
                    console.log("test", this);
                    this.setState({
                        sellerAddressArr: this.state.sellerAddressArr.concat(result.args._seller)
                    });
                }else if (typeof result.args.__seller != "undefined"){
                    console.log("seller removed?");
                    console.log("test", this);
                    var arr = this.state.sellerAddressArr;
                    var index = arr.indexOf(result.args.__seller);
                    if (index > -1){
                        arr.splice(index, 1);
                        this.setState({
                            sellerAddressArr: arr
                        });
                    }
                }else if (typeof result.args.seller != 'undefined' && typeof result.args.price != 'undefined' && typeof result.args.prodID != 'undefined' && typeof result.args.buyer == 'undefined' && typeof result.args.quantity != 'undefined'){
                    console.log("product listed?");
                    console.log("test", this);
                    const newProdList = {
                        [[result.args.seller, result.args.prodID]]: [result.args.price, result.args.quantity]
                    };
                    const new2Prod = Object.assign(this.state.merch, newProdList);
                    this.setState({
                        merch: new2Prod
                    });
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
    }

    handleListProdNameChange(event){
        //console.log("namechange");
        this.setState({
            prodNameInput: event.target.value
        });
    }
    // handleBuyNumChange(event){
    //     this.refs.
    // }
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
    handleBuyNum(e,val, a ,b ,c){
        console.log("hello");
        e.preventDefault();
        var thing = document.getElementById(val).value;
        console.log(thing);
        this.buyProd(a, web3.eth.defaultAccount, b, thing, c);
    }


    // buyProd(_vendor, _buyer, _prodID, _quantity, _price){
    //     console.log("stuck");
    //     this.state.ContractInstance.buyGoods(_vendor, _buyer, _prodID, _quantity, {
    //         gas: 1000000,
    //         from: web3.eth.defaultAccount,
    //         value: web3.toWei(_quantity * _price, "finney")
    //     }).then(function(r) {
    //         console.log("Bought Product hopefully!")
    //     })
    //     this.state.merch
    // }

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
            <table border="1">
            <tbody>
            <tr><th>Seller Addresses</th><th><button onClick={this.buySeller}>Become a Seller!</button></th></tr>
            {this.state.sellerAddressArr.map((key, index) => {
                return <tr><td key={index}>{key}</td></tr>
            })}
            </tbody>
            </table>
            {/*
            <div align="left"><button onClick={this.buySeller} align='left' >Become a Seller!</button></div>
            */}
            <div align="right"><button onClick={this.remSeller} align='right'>Remove a Seller!</button></div>
            <form onSubmit={this.handleListProdSubmit}>
            <h2>List a Product!</h2>
            <label>
            Product Name
            <div><input type="text" value={this.state.prodNameInput} onChange={this.handleListProdNameChange}/></div>
            </label>
            <label>
            Price
            <div><input type="number" value={this.state.prodNumInput} onChange={this.handleListProdNumChange}/></div>
            </label>
            <label>
            Quantity
            <div><input type="number"value={this.state.prodQuantInput} onChange={this.handleListProdQuantChange}/></div>
            </label>
            <input type="submit" value="Submit" />
            </form>
            <table border="1">
            <tbody>
            <tr>
            <th>Vendor</th>
            <th>Product ID</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Buy</th>
            </tr>
            {Object.keys(this.state.merch).map(function(key) {
                //console.log("test", this);
                // console.log("test:" + key);
                // console.log(this.state.merch[key]);
                var [a, b] = key.split(',')
            return (
                <TableRow a={a} b={b} price={this.state.merch[key][0].c} cont={this.state.ContractInstance} web3={web3} quantity={this.state.merch[key][1].c}></TableRow>
            )
            //    console.log("Test: " + this.state.merch[key]);
                //return //<div>Key: {key}, Value: {yourObject[key]}</div>;
                //<tr>
                //<td>{key[0]}</td>
                //{console.log("hi")}
                //{console.log({key})}
                //<td>{key[1]}</td>
                //</tr>
                // for (var key in this.state.merch)
                    // <tr>
                    //     <td>{key[0]}</td>
                    //     <td>{key[1]}</td>
                    //     <td>{this.state.merch.key.0}</td>
                    //     <td>{this.state.merch.key.1}</td>
                    // </tr>
                // }}
            }, this)}
            </tbody>
            </table>
            </div>
        )
    }
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
