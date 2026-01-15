
import * as actions from '../constants/userConstants'

export const userLoginReducer = (state = { userInfo: {} }, action: any) => {
	switch (action.type) {
		case actions.USER_LOGIN_REQUEST:
			return { ...state, loading: true }

		case actions.USER_LOGIN_SUCCESS:
			return { loading: false, userInfo: action.payload }

		case actions.USER_LOGIN_FAIL:
			return { ...state, loading: false, error: action.payload }
		case actions.USER_LOGOUT:
			return { userInfo: null }

		default:
			return state
	}
}

export const userRegisterReducer = (state = { userInfo: {} }, action: any) => {
	switch (action.type) {
		case actions.USER_REGISTER_REQUEST:
			return { ...state, loading: true }
		case actions.USER_REGISTER_SUCCESS:
			return { loading: false, userInfo: action.payload }
		case actions.USER_REGISTER_FAIL:
			return { ...state, loading: false, error: action.payload }
		default:
			return state
	}
}

export const userDetailsReducer = (state = { user: {} }, action: any) => {
	switch (action.type) {
		case actions.USER_DETAILS_REQUEST:
			return { ...state, loading: true }

		case actions.USER_DETAILS_SUCCESS:
			return { loading: false, user: action.payload }

		case actions.USER_DETAILS_FAIL:
			return { ...state, loading: false, error: action.payload }

		case actions.USER_DETAILS_RESET:
			return { user: {} }
		default:
			return state
	}
}

export const userUpdateProfileReducer = (state = { userInfo: {} }, action: any) => {
	switch (action.type) {
		case actions.USER_UPDATE_PROFILE_REQUEST:
			return { ...state, loading: true, success: false }
		case actions.USER_UPDATE_PROFILE_SUCCESS:
			return { loading: false, success: true, userInfo: action.payload }
		case actions.USER_UPDATE_PROFILE_FAIL:
			return { ...state, loading: false, success: false, error: action.payload }

		case actions.USER_UPDATE_PROFILE_RESET:
			return { userInfo: {} }

		default:
			return state
	}
}
