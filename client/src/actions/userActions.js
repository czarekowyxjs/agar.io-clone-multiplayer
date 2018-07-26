export const fetchUserAfterLogin = (username) => {
	return {
		type: "FETCH_USER_AFTER_LOGIN",
		username: username
	};
};