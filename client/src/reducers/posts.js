import { CREATE, DELETE, FETCH_POST, FETCH_ALL, FETCH_BY_SEARCH, START_LOADING, END_LOADING, LIKE, UPDATE, COMMENT } from "../constants/actionTypes";

export default (state = { isLoading: true, posts: [], numberOfPages: 3 }, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ALL:
      return {
        ...state,
        currentPage: action.payload.currentPage,
        numberofPages: action.payload.numberOfPages,
        posts: action.payload.data,
      }
    case FETCH_BY_SEARCH:
      return { ...state, posts: action.payload };
    case FETCH_POST:
      return { ...state, post: action.payload };
    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };
    case DELETE:
      return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
    case UPDATE:
      return { ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post) };
    case LIKE:
      return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
    case COMMENT:
      return { ...state, 
        posts: state.posts.map((post) => {
        // map the just commented post to the returned action payload
        if(post._id === action.payload._id) {
          return action.payload;
        }
        // map other posts normally
        return post;
      })
    };
    default:
      return state;
  }
};
