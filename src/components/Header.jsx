import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveNewTodo } from "../features/todos/todosSlice";

const Header = () => {
	const [text, setText] = useState("");
	const dispatch = useDispatch();

	const handleChange = (e) => setText(e.target.value);

	const handleKeyDown = (e) => {
		if (!text) {
			return;
		}

		if (e.key === "Enter") {
			dispatch(saveNewTodo(text));
			setText("");
		}
	};

	return (
		<header className="header">
			<input
				className="new-todo"
				placeholder="What needs to be done?"
				autoFocus={true}
				value={text}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
		</header>
	);
};

export default Header;
