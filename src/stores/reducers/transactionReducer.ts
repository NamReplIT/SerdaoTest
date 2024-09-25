import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppSettingProps = {

};

export const initSliceSate = {} as AppSettingProps;

export const appSettingSlice = createSlice({
    name: "transactionReducer",
    initialState: { ...initSliceSate },
    reducers: {
        update: (state, action: PayloadAction<{ active: boolean }>) => {
            return state;
        },
    },
});
export const { update } = appSettingSlice.actions;
export default appSettingSlice.reducer;
