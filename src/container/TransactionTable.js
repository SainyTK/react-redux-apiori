import _ from 'lodash';
import React, { Component } from "react";
import { connect } from 'react-redux';
import { edit } from '../actions/action';
import {
  EDIT_TRANS_TABLE
} from '../actions/actionTypes';

class TransactionTable extends Component {

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
        let { transTable } = this.props;
        transTable[name] = value;

        this.props.dispatch(edit(EDIT_TRANS_TABLE, transTable));
    }
}

const mapStateToProps = state => ({
    numTrans: state.numTrans,
    transTable: state.transTable
});

export default connect(mapStateToProps)(TransactionTable);