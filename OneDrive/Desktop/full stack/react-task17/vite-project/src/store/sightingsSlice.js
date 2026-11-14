import { createSlice, nanoid } from '@reduxjs/toolkit'

const starterEntries = [
  { id: 'seed-1', object: 'The Pleiades', date: '2025-11-18', equipment: 'Binoculars, 10×50', notes: 'Seven sisters, and then a few more once my eyes settled in. A crisp little cluster against the dark.', rating: 5 },
  { id: 'seed-2', object: 'Jupiter', date: '2025-10-24', equipment: 'Naked eye', notes: 'Bright enough to find before the rest of the stars came out. Watched it rise over the rooftops.', rating: 4 },
]

function readEntries() {
  try {
    const stored = JSON.parse(localStorage.getItem('nightjar-observations') ?? 'null')
    return Array.isArray(stored) ? stored : starterEntries
  } catch {
    return starterEntries
  }
}

const sightingsSlice = createSlice({
  name: 'sightings',
  initialState: { items: readEntries() },
  reducers: {
    addObservation: {
      reducer(state, action) { state.items.unshift(action.payload) },
      prepare(entry) { return { payload: { ...entry, id: nanoid() } } },
    },
    updateObservation(state, action) {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) state.items[index] = action.payload
    },
    deleteObservation(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
})

export const { addObservation, updateObservation, deleteObservation } = sightingsSlice.actions
export default sightingsSlice.reducer
