import { client } from "../../api/client";
import { createSelector } from "reselect";
import { StatusFilters } from "../filters/filtersSlice";

const initialState = {
	status: "idle", // or: 'loading', 'succeeded', 'failed'
	entities: {},
};

// function nextTodoId(todos) {
// 	const maxID = todos.reduce((maxId, cur) => Math.max(maxId, cur.id), -1);
// 	return maxID + 1;
// }

export default function todosReducer(state = initialState, action) {
	switch (action.type) {
		case "todos/todoAdded": {
			const todo = action.payload;
			return {
				...state,
				entities: {
					...state.entities,
					[todo.id]: todo,
				},
			};
		}

		case "todos/todoToggled": {
			const todoId = action.payload;
			const todo = state.entities[todoId];
			return {
				...state,
				entities: {
					...state.entities,
					[todoId]: { ...todo, completed: !todo.completed },
				},
			};
		}

		case "todos/colorSelected": {
			const { todoId, color } = action.payload;
			const todo = state.entities[todoId];
			return {
				...state,
				entities: {
					...state.entities,
					[todoId]: {
						...todo,
						color,
					},
				},
			};
		}
		case "todos/todoDeleted": {
			const newEntities = { ...state.entities };
			delete newEntities[action.payload];
			return {
				...state,
				entities: newEntities,
			};
		}
		case "todos/allCompleted": {
			const newEntities = { ...state.entities };
			Object.values(newEntities).forEach((todo) => {
				newEntities[todo.id] = { ...todo, completed: true };
			});

			return {
				...state,
				entities: newEntities,
			};
		}
		case "todos/completedCleared": {
			const newEntities = { ...state.entities };
			Object.values(newEntities).forEach((todo) => {
				if (todo.completed) {
					delete newEntities[todo.id];
				}
			});

			return {
				...state,
				entities: newEntities,
			};
		}
		case "todos/todosLoading": {
			return {
				...state,
				status: "loading",
			};
		}

		case "todos/todosLoaded": {
			const newEntities = {};
			action.payload.forEach((todo) => {
				newEntities[todo.id] = todo;
			});

			return {
				...state,
				status: "idle",
				entities: newEntities,
			};
		}

		default:
			return state;
	}
}

export const selectTodoEntities = (state) => {
	return state.todos.entities;
};

export const todosRemaining = (state) => {
	const unCompletedTodos = Object.values(selectTodoEntities(state)).filter(
		(todo) => !todo.completed
	);
	return unCompletedTodos.length;
};

export const selectTodoById = (state, todoId) => {
	return selectTodoEntities(state)[todoId];
};

export const selectLoadingStatus = (state) => state.todos.status;

// memoized selector
export const selectTodoIds = createSelector(selectTodoEntities, (entities) =>
	Object.keys(entities)
);

export const selectFilteredTodos = createSelector(
	selectTodoEntities,
	(state) => state.filters,
	(entities, filters) => {
		const todos = Object.values(entities);
		const { status, colors } = filters;
		const showAllCompletions = status === StatusFilters.All;
		if (showAllCompletions && colors.length === 0) {
			return todos;
		}

		const completedStatus = status === StatusFilters.Completed;

		return todos.filter((todo) => {
			const statusMatches =
				showAllCompletions || todo.completed === completedStatus;
			const colorMatches = colors.length === 0 || colors.includes(todo.color);
			return statusMatches && colorMatches;
		});
	}
);

export const selectFilteredTodoIds = createSelector(
	selectFilteredTodos,
	(filteredTodos) => filteredTodos.map((todo) => todo.id)
);

// action creator
export const todoAdded = (todo) => ({
	type: "todos/todoAdded",
	payload: todo,
});

export const todosLoaded = (todos) => ({
	type: "todos/todosLoaded",
	payload: todos,
});

export const todoColorSelected = (todoId, color) => ({
	type: "todos/colorSelected",
	payload: { todoId, color },
});

export const todoDeleted = (todoId) => ({
	type: "todos/todoDeleted",
	payload: todoId,
});

export const todoToggled = (todoId) => ({
	type: "todos/todoToggled",
	payload: todoId,
});

export const todosMarkAllCompleted = () => ({
	type: "todos/allCompleted",
});

export const todosClearCompleted = () => ({
	type: "todos/completedCleared",
});

export const todosLoading = () => ({ type: "todos/todosLoading" });

// Thunk

export const fetchTodos = () => async (dispatch, getState) => {
	dispatch(todosLoading());
	const response = await client.get("/fakeApi/todos");
	dispatch(todosLoaded(response.todos));
};

export function saveNewTodo(text) {
	return async function saveNewTodoThunk(dispatch, getState) {
		const initialTodo = { text };
		const response = await client.post("/fakeApi/todos", { todo: initialTodo });
		dispatch(todoAdded(response.todo));
	};
}
