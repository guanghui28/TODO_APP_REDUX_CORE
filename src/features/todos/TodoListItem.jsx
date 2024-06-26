import { availableColors, capitalize } from "../filters/colors";
import { MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
	selectTodoById,
	todoColorSelected,
	todoDeleted,
	todoToggled,
} from "./todosSlice";

const TodoListItem = ({ id }) => {
	const todo = useSelector((state) => selectTodoById(state, id));
	const { text, completed, color } = todo;
	const dispatch = useDispatch();

	const handleCompletedChanged = () => {
		dispatch(todoToggled(id));
	};

	const handleColorChanged = (e) => {
		dispatch(todoColorSelected(id, e.target.value));
	};

	const handleDelete = () => {
		if (!confirm("Are you sure to delete this todo?")) return;
		dispatch(todoDeleted(id));
	};

	const colorOptions = availableColors.map((c) => (
		<option key={c} value={c}>
			{capitalize(c)}
		</option>
	));

	return (
		<li>
			<div className="view">
				<div className="segment label">
					<input
						className="toggle"
						type="checkbox"
						checked={completed}
						onChange={handleCompletedChanged}
					/>
					<div className="todo-text">{text}</div>
				</div>
				<div className="segment buttons">
					<select
						className="colorPicker"
						value={color}
						style={{ color }}
						onChange={handleColorChanged}
					>
						<option value=""></option>
						{colorOptions}
					</select>
					<button className="destroy" onClick={handleDelete}>
						<MdDelete />
					</button>
				</div>
			</div>
		</li>
	);
};

export default TodoListItem;
