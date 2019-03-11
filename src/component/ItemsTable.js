import React from 'react';
import styled from 'styled-components'

const WrappedTable = styled.div`
    margin: 0px 10px;
    width: 80%;
    text-size: 11px;
`

const ItemsTable = props => {
    const { items } = props;
    return (
        <WrappedTable>
            <h4>Frequence Itemsets</h4>
            <p>There are {items.length} frequence itemsets</p>
            <table className='table'>
                <thead>
                    <tr>
                        <th scope='row'>#</th>
                        <th scope='row'>Items</th>
                        <th scope='row'>Support</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx}>
                            <th scope='col'>{idx + 1}</th>
                            <td>{`${item.itemSet.join(', ')}`}</td>
                            <td>{item.support * 100}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </WrappedTable>
    )
}

export default ItemsTable;