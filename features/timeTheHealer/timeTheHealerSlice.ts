import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "features/app/store";
import { Failure, Success } from "services/BaseMonadicService";
import SettingsService, {
  FetchTimeTheHealerResponse,
} from "services/SettingsService";

interface TimeTheHealerState {
  dateTimeToExecute: undefined | null | string;
}

const initialState: TimeTheHealerState = { dateTimeToExecute: undefined };

const fetchTimeTheHealer = createAsyncThunk<
  FetchTimeTheHealerResponse,
  void,
  { state: RootState }
>("timeTheHealer/fetchTimeTheHealer", async () => {
  const response: Success<FetchTimeTheHealerResponse> | Failure =
    await new SettingsService().fetchTimeTheHealer();
  if (response instanceof Success) {
    return response.data;
  }
  throw response;
});

const timeTheHealerSlice = createSlice({
  name: "timeTheHealer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTimeTheHealer.fulfilled, (state, action) => {
      state.dateTimeToExecute = action.payload?.dateTimeToExecute;
    });
  },
});

export default timeTheHealerSlice.reducer;

export { fetchTimeTheHealer };
