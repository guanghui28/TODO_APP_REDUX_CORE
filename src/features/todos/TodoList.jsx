import TodoListItem from "./TodoListItem";
import { useSelector } from "react-redux";
import { selectFilteredTodoIds } from "./todosSlice";
import { selectLoadingStatus } from "./todosSlice";

const TodoList = () => {
	const todoIds = useSelector(selectFilteredTodoIds);
	const loadingStatus = useSelector(selectLoadingStatus);

	if (loadingStatus === "loading") {
		return (
			<div className="todo-list">
				<div className="loader"></div>
			</div>
		);
	}

	const renderedListItems = todoIds.map((todoId) => {
		return <TodoListItem key={todoId} id={todoId} />;
	});

	return <ul className="todo-list">{renderedListItems}</ul>;
};

export default TodoList;
