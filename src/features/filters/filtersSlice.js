export const StatusFilters = {
	All: "all",
	Active: "active",
	Completed: "completed",
};

const initialState = {
	status: "All",
	colors: [],
};

// {type: 'filters/statusFilterChanged', payload: filterValue}
// {type: 'filters/colorFilterChanged', payload: {color, changeType}}

export default function filtersReducer(state = initialState, action) {
	switch (action.type) {
		case "filters/statusFilterChanged":
			return {
				...state,
				status: action.payload,
			};
		case "filters/colorFilterChanged": {
			let { color, changeType } = action.payload;
			const { colors } = state;

			switch (changeType) {
				case "added": {
					if (colors.includes(color)) {
						return state;
					}

					return {
						...state,
						colors: colors.concat(color),
					};
				}
				case "remove": {
					return {
						...state,
						colors: colors.filter((c) => c !== color),
					};
				}

				default:
					return state;
			}
		}

		default:
			return state;
	}
}
