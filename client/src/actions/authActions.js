import axios from 'axios';
import { fetchUserAfterLogin } from './userActions';

export const simpleLogin = (username) => {
	return async dispatch => {
		try {

			const response = await axios.post("/api/login", {
				username: username
			});

			if(!response.data.errors) {
				dispatch(fetchUserAfterLogin(username));
				dispatch(logged());
			}

		} catch(e) {
			dispatch(notLogged(e.response.data.errors));
		}
	};
};

export const logged = () => {
	return {
		type: "AUTH_LOGIN_SUCCESS"
	};
};

export const notLogged = (error) => {
	return {
		type: "AUTH_LOGIN_ERROR",
		error: error
	};
};