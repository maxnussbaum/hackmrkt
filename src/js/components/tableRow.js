import React,{Component} from 'react';

class TableRow extends Component {

    constructor(props){
        super(props)
        this.state={
            inputVal:0
        }
        this.buyProd = this.buyProd.bind(this);
    }

    buyProd(_vendor, _buyer, _prodID, _quantity, _price){
        console.log("stuck");
        this.props.cont.buyGoods(_vendor, _buyer, _prodID, _quantity, {
            gas: 1000000,
            from: this.props.web3.eth.defaultAccount,
            value: this.props.web3.toWei(_quantity * _price, "finney")
        }).then(function(r) {
            console.log("Bought Product hopefully!")
        })
    }



    render (){
        return (
            <tr>
                <td>{this.props.a}</td>
                <td>{this.props.b}</td>
                <td>{this.props.price}</td>
                <td>{this.props.quantity}</td>
                <td><form   onChange={(event) => {
                    this.setState({
                        inputVal:event.target.value
                    })

                }}
                            onSubmit={(e)=>this.buyProd(this.props.a, this.props.b, this.props.quantity, this.props.price)}><input type="number" value={this.state.inputVal}/>
                <input type="submit" value="Submit"/></form></td>
            </tr>
        )
    }
}
export default TableRow;
