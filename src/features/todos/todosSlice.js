import {
	createAsyncThunk,
	createSelector,
	createSlice,
	createEntityAdapter,
} from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { StatusFilters } from "../filters/filtersSlice";

const todosAdapter = createEntityAdapter();

const initialState = todosAdapter.getInitialState({
	status: "idle",
});

// Thunk

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
	const response = await client.get("/fakeApi/todos");
	return response.todos;
});

export const saveNewTodo = createAsyncThunk(
	"todos/saveNewTodo",
	async (text) => {
		const initialTodo = { text };
		const response = await client.post("/fakeApi/todos", { todo: initialTodo });
		return response.todo;
	}
);

const todosSlice = createSlice({
	name: "todos",
	initialState,
	reducers: {
		todoAdded(state, action) {
			const todo = action.payload;
			state.entities[todo.id] = todo;
		},
		todoToggled(state, action) {
			const todoId = action.payload;
			const todo = state.entities[todoId];
			todo.completed = !todo.completed;
		},
		todoColorSelected: {
			prepare(todoId, color) {
				return {
					payload: { todoId, color },
				};
			},
			reducer(state, action) {
				const { color, todoId } = action.payload;
				state.entities[todoId].color = color;
			},
		},
		todoDeleted: todosAdapter.removeOne,
		allTodosCompleted(state, action) {
			Object.values(state.entities).forEach((todo) => {
				todo.completed = true;
			});
		},
		completedTodosCleared(state, action) {
			const completedIds = Object.values(state.entities)
				.filter((todo) => todo.completed)
				.map((todo) => todo.id);

			todosAdapter.removeMany(state, completedIds);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTodos.pending, (state, action) => {
				state.status = "loading";
			})
			.addCase(fetchTodos.fulfilled, (state, action) => {
				todosAdapter.setAll(state, action.payload);
				state.status = "idle";
			})
			.addCase(saveNewTodo.fulfilled, todosAdapter.addOne);
	},
});

export const {
	allTodosCompleted,
	completedTodosCleared,
	todoAdded,
	todoColorSelected,
	todoDeleted,
	todoToggled,
	todosLoaded,
	todosLoading,
} = todosSlice.actions;
export default todosSlice.reducer;

export const { selectAll: selectTodos, selectById: selectTodoById } =
	todosAdapter.getSelectors((state) => state.todos);

export const todosRemaining = (state) => {
	const remains = Object.values(state.todos.entities).filter(
		(todo) => !todo.completed
	);
	return remains.length;
};

export const selectTodoIds = createSelector(selectTodos, (todos) => {
	return todos.map((todo) => todo.id);
});

export const selectLoadingStatus = (state) => state.todos.status;

export const selectFilteredTodos = createSelector(
	selectTodos,
	(state) => state.filters,
	(todos, filters) => {
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
