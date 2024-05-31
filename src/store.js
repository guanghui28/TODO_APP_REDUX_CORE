import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer";
import { composeWithDevTools } from "@redux-devtools/extension";
import { print1, print2, print3 } from "./exampleAddons/middleware";

const middlewareEnhancer = applyMiddleware(print1, print2, print3);
const composedEnhancer = composeWithDevTools(middlewareEnhancer);

const store = createStore(rootReducer, composedEnhancer);
export default store;
