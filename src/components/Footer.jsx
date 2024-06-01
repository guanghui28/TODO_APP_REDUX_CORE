import { availableColors, capitalize } from "../features/filters/colors";
import {
	colorFilterChanged,
	statusFilterChanged,
	StatusFilters,
} from "../features/filters/filtersSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
	todosClearCompleted,
	todosMarkAllCompleted,
	todosRemaining,
} from "../features/todos/todosSlice";

const RemainingTodos = ({ count }) => {
	const suffix = count === 1 ? "" : "s";

	return (
		<div className="todo-count">
			<h5>Remaining Todos</h5>
			<strong>{count}</strong> item{suffix} left
		</div>
	);
};

const StatusFilter = ({ value: status, onChange }) => {
	const renderedFilters = Object.keys(StatusFilters).map((key) => {
		const value = StatusFilters[key];
		const handleClick = () => onChange(value);
		const className = value === status ? "selected" : "";

		return (
			<li key={value}>
				<button className={className} onClick={handleClick}>
					{key}
				</button>
			</li>
		);
	});

	return (
		<div className="filters statusFilters">
			<h5>Filter by Status</h5>
			<ul>{renderedFilters}</ul>
		</div>
	);
};

const ColorFilters = ({ value: colors, onChange }) => {
	const renderedColors = availableColors.map((color) => {
		const checked = colors.includes(color);
		const handleChange = () => {
			const changeType = checked ? "removed" : "added";
			onChange(color, changeType);
			console.log(checked);
		};

		return (
			<label key={color}>
				<input
					type="checkbox"
					name={color}
					checked={checked}
					onChange={handleChange}
				/>
				<span
					className="color-block"
					style={{
						backgroundColor: color,
					}}
				></span>
				{capitalize(color)}
			</label>
		);
	});

	return (
		<div className="filters colorFilters">
			<h5>Filter by Color</h5>
			<form className="colorSelection">{renderedColors}</form>
		</div>
	);
};

const Footer = () => {
	const { status, colors } = useSelector((state) => state.filters);
	const todosRemainingLength = useSelector(todosRemaining);

	const dispatch = useDispatch();

	const onColorChange = (color, changeType) =>
		dispatch(colorFilterChanged(color, changeType));
	const onStatusChange = (status) => dispatch(statusFilterChanged(status));
	const handleMarkAllCompleted = () => dispatch(todosMarkAllCompleted());
	const handleClearCompleted = () => dispatch(todosClearCompleted());

	return (
		<footer className="footer">
			<div className="actions">
				<h5>Actions</h5>
				<button className="button" onClick={handleMarkAllCompleted}>
					Mark All Completed
				</button>
				<button className="button" onClick={handleClearCompleted}>
					Clear Completed
				</button>
			</div>

			<RemainingTodos count={todosRemainingLength} />
			<StatusFilter value={status} onChange={onStatusChange} />
			<ColorFilters value={colors} onChange={onColorChange} />
		</footer>
	);
};

export default Footer;
