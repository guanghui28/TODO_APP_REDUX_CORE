import { client } from "../../api/client";

const initialState = [];

// function nextTodoId(todos) {
// 	const maxID = todos.reduce((maxId, cur) => Math.max(maxId, cur.id), -1);
// 	return maxID + 1;
// }

export default function todosReducer(state = initialState, action) {
	switch (action.type) {
		case "todos/todoAdded":
			return [...state, action.payload];
		case "todos/todosLoaded":
			return action.payload;
		case "todos/todoToggled":
			return state.map((todo) => {
				if (todo.id !== action.payload) {
					return todo;
				}
				return {
					...todo,
					completed: !todo.completed,
				};
			});
		case "todos/colorSelected": {
			const { todoId, color } = action.payload;

			return state.map((todo) => {
				if (todo.id !== todoId) {
					return todo;
				}
				return {
					...todo,
					color,
				};
			});
		}
		case "todos/todoDeleted": {
			return state.filter((todo) => todo.id !== action.payload);
		}
		case "todos/allCompleted": {
			return state.map((todo) => ({ ...todo, completed: true }));
		}
		case "todos/completedCleared": {
			return state.filter((todo) => !todo.completed);
		}

		default:
			return state;
	}
}

export async function fetchTodos(dispatch, getState) {
	const response = await client.get("/fakeApi/todos");

	dispatch({ type: "todos/todosLoaded", payload: response.todos });
}

export function saveNewTodo(text) {
	return async function saveNewTodoThunk(dispatch, getState) {
		const initialTodo = { text };
		const response = await client.post("/fakeApi/todos", { todo: initialTodo });
		dispatch({ type: "todos/todoAdded", payload: response.todo });
	};
}
