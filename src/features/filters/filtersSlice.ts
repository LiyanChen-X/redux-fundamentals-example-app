import { createSlice } from '@reduxjs/toolkit'

export enum StatusFilters {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}


interface FilterState {
  status: StatusFilters,
  colors: string[]
}


const initialState: FilterState = {
  status: StatusFilters.All,
  colors: [],
}

// since immer handles the state change for us, we do not need to write immutable code anymore, which saves us a lot time.
const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    statusFilterChanged(state, action) {
      state.status = action.payload
    },
    colorFilterChanged: {
      reducer(state, action) {
        let { color, changeType } = action.payload
        const { colors } = state
        switch (changeType) {
          case 'added': {
            if (!colors.includes(color)) {
              colors.push(color)
            }
            break
          }
          case 'removed': {
            state.colors = colors.filter(
              (existingColor) => existingColor !== color
            )
            break
          }
          default:
            return
        }
      },
      prepare(color, changeType) {
        return {
          payload: { color, changeType },
          meta: {},
          error: {}
        }
      },
    },
  },
})

export const { colorFilterChanged, statusFilterChanged } = filtersSlice.actions

export default filtersSlice.reducer
