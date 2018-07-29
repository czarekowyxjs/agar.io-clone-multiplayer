const initialState = {
	logged: false,
	authError: {}
};

export default (state = initialState, action) => {
	switch(action.type) {
		case "AUTH_LOGIN_SUCCESS":
			return {
				...state,
				logged: true
			};
		case "AUTH_LOGIN_ERROR":
			return {
				...state,
				authError: action.error
			};
		default:
			return state;
	}
};