import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveNewTodo } from "../features/todos/todosSlice";

const Header = () => {
	const [text, setText] = useState("");
	const [status, setStatus] = useState("idle");
	const dispatch = useDispatch();

	const handleChange = (e) => setText(e.target.value);

	const handleKeyDown = async (e) => {
		if (!text) {
			return;
		}

		if (e.key === "Enter") {
			setStatus("loading");
			await dispatch(saveNewTodo(text));
			setText("");
			setStatus("idle");
		}
	};
	let isLoading = status === "loading";
	let placeholder = isLoading ? "" : "What needs to be done?";
	let loader = isLoading ? <div className="loader" /> : null;

	return (
		<header className="header">
			<input
				className="new-todo"
				placeholder={placeholder}
				autoFocus={true}
				value={text}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
			{loader}
		</header>
	);
};

export default Header;
