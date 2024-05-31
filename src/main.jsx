import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./store.js";

console.log("Dispatching action");
store.dispatch({ type: "todos/todoAdded", payload: "Learn about actions" });
console.log("State after dispatch: ", store.getState());
console.log("Dispatch complete");

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
