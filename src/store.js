import { configureStore } from "@reduxjs/toolkit";
import CounterReducer from "./pages/Counter/counterSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here
    counter: CounterReducer,
  },
});