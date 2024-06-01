import { createSlice } from "@reduxjs/toolkit";

export const StatusFilters = {
	All: "all",
	Active: "active",
	Completed: "completed",
};

const initialState = {
	status: "all",
	colors: [],
};

// {type: 'filters/statusFilterChanged', payload: filterValue}
// {type: 'filters/colorFilterChanged', payload: {color, changeType}}

const filtersSlice = createSlice({
	name: "filters",
	initialState,
	reducers: {
		statusFilterChanged(state, action) {
			state.status = action.payload;
		},
		colorFilterChanged: {
			prepare(color, changeType) {
				return {
					payload: {
						color,
						changeType,
					},
				};
			},
			reducer(state, action) {
				const { color, changeType } = action.payload;
				const { colors } = state;
				switch (changeType) {
					case "added": {
						if (!colors.includes(color)) {
							colors.push(color);
						}
						break;
					}

					case "removed": {
						state.colors = colors.filter((c) => c !== color);
						break;
					}
					default:
						return;
				}
			},
		},
	},
});

export default filtersSlice.reducer;

export const { statusFilterChanged, colorFilterChanged } = filtersSlice.actions;
