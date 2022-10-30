import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { SET_TIMER_REMAINING } from "actiontypes/timer";
import authInterceptor from "middleware/authInterceptor";
import rootReducer from "reducers/index";
import { IAppState } from "types/app";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        warnAfter: 100, // Ignore unless very slow; we want immutable checks, and we accept that this takes a while in dev
      },
    }).concat(authInterceptor),
  devTools: {
    actionsBlacklist: [SET_TIMER_REMAINING],
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<IAppState> = useSelector;
