import { useState } from "react";
import { useDispatch } from "react-redux";

const Header = () => {
	const [text, setText] = useState("");
	const dispatch = useDispatch();

	const handleChange = (e) => setText(e.target.value);

	const handleKeyDown = (e) => {
		if (!text) {
			return;
		}

		if (e.key === "Enter") {
			dispatch({ type: "todos/todoAdded", payload: text });
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
