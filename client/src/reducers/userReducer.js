const initialState = {
	username: ''
};

export default (state = initialState, action) => {
	switch(action.type) {
		case "FETCH_USER_AFTER_LOGIN":
			return {
				...state,
				username: action.username
			};
		default:
			return state;
	}
};