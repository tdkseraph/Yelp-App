const types ={
    loginScreen:'LoginScreen',
    searchScreen:'SearchScreen',
    filterScreen:'FilterScreen'
}

export const reducer = (state = {}, action) => {
    switch(action.type){
        case 'LoginScreen':
        return {
            ...state,
            params: action.payload
        }
        break;
        case 'SearchScreen':
        return {
            ...state,
            params: action.payload
        }
        break;
        case 'FilterScreen':
        return {
            ...state,
            params: action.payload
        }
        break;
        default:
    }
    return state;
}

export const actionCreators = {
    storeUserInfo(params){
        return {
            type:types.loginScreen,
            payload: params
        }
    },
    storeFilterSettings(params){
        return {
            type:types.filterScreen,
            payload: params
        }
    }
}