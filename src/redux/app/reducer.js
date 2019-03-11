import actions from './actions';

const initialState = {
    minCon: 0.2,
    minSup: 0.2,
    numTrans: 5,
    transTable: [],
    freqItems: [],
    rules: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actions.SET_MIN_CON:
            return {
                ...state,
                minCon: action.payload
            };
        case actions.SET_MIN_SUP:
            return {
                ...state,
                minSup: action.payload
            };
        case actions.SET_NUM_TRANS:
            return {
                ...state,
                numTrans: action.payload
            }
        case actions.SET_TRANS_TABLE:
            return {
                ...state,
                transTable: action.payload.transTable,
            }
        case actions.SET_FREQ_ITEMS:
            return {
                ...state,
                freqItems: action.payload.freqItems
            }
        case actions.SET_RULES:
            return {
                ...state,
                rules: action.payload
            }
        default: return state;
    }
}