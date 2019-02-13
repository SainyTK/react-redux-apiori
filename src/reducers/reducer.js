import {
    EDIT_MIN_CON,
    EDIT_MIN_SUP,
    EDIT_NUM_TRANS,
    EDIT_TRANS_TABLE
} from '../actions/actionTypes';

const initialState = {
    minCon: 0.2,
    minSup: 0.2,
    numTrans: 5,
    transTable: []
};

function edit(state = initialState, action) {
    switch (action.type) {
        case EDIT_MIN_CON:
            return {
                ...state,
                minCon: action.payload
            };
        case EDIT_MIN_SUP:
            return {
                ...state,
                minSup: action.payload
            };
        case EDIT_NUM_TRANS:
            return {
                ...state,
                numTrans: action.payload
            }
        case EDIT_TRANS_TABLE:
            return {
                ...state,
                transTable: action.payload
            }
        default: return state;
    }
}

export default edit;