import { CHECK_START } from '../constants/actionTypes';

const initialState = {
  navigate: false
};

const startReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_START:
      console.log("START REDUCER 여기 들어와야행!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1=-==========", action.payload);
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default startReducer;
