import React,{Component} from 'react';

class TableRow extends Component {
    render (){
        return (
            <tr>
                <td>{this.props.a}</td>
                <td>{this.props.b}</td>
                <td>{this.props.price}</td>
                <td>{this.props.quantity}</td>
                <td><form onSubmit={(e)=>this.handleBuyNum(e, this.props.a, this.props.b, this.props.price)}><input type="number" value={0}/>
                <input type="submit" value="Submit"/></form></td>
            </tr>
        )
    }
}
export default TableRow;
