import _ from 'lodash';
import React, { Component } from "react";
import { connect } from 'react-redux';
import Actions from '../redux/app/actions';

class TransactionTable extends Component {

    state = {
        transTableString:[]
    }

    render() {
        const { numTrans } = this.props;
        return (
            <table>
                <thead>
                    <tr>
                        <th>Transaction id</th>
                        <th>item set</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows(numTrans)}
                </tbody>
            </table>
        );
    }

    renderRows(n) {
        return _.range(n).map((i, k) => (
            <tr key={k}>
                <td>{(k + 1)}</td>
                <td>
                    <input name={k} type="text" onBlur={this.handleFocusOut} />
                </td>
            </tr>
        ));
    }

    handleFocusOut = (e) => {
        const { name, value } = e.target;
        let { transTableString } = this.state;
        transTableString[name] = value;

        this.props.setTransTable(transTableString);
    }
}

export default connect(state => state.App, Actions)(TransactionTable);