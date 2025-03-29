import { createSlice } from "@reduxjs/toolkit";

interface CommonState {
  data: null;
}

const initialState: CommonState = {
  data: null,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {},
});

export const { } = commonSlice.actions;
export default commonSlice.reducer;