import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ThunkApiConfig } from "features/app/store";
import ContactService, {
  AddContactResponse,
  IContact,
} from "services/ContactService";
import { Success } from "services/BaseMonadicService";

export type AddContactArg = { userName: string };
export type DeleteContactArg = { userID: number };
export type DeleteContactResponse = DeleteContactArg;

export interface IContactsState {
  contacts: IContact[];
  isAdding: boolean;
  isDeleting: boolean;
  isFetching: boolean;
}

const initialState: IContactsState = {
  contacts: [],
  isAdding: false,
  isDeleting: false,
  isFetching: false,
};

const service = new ContactService();

const addContact = createAsyncThunk<
  AddContactResponse,
  AddContactArg,
  ThunkApiConfig
>("contacts/addContact", async ({ userName }) => {
  const response = await service.addContact(userName);
  if (response instanceof Success) {
    return response.data;
  }

  throw response;
});

const addFromFacebook = createAsyncThunk<void, void, ThunkApiConfig>(
  "contacts/addFromFacebook",
  async () => {
    const response = await service.addFacebookContacts();
    if (!(response instanceof Success)) {
      throw response;
    }
  }
);

const deleteContact = createAsyncThunk<
  DeleteContactResponse,
  DeleteContactArg,
  ThunkApiConfig
>("contacts/deleteContact", async ({ userID }) => {
  const response = await service.deleteContact(userID);
  if (response instanceof Success) {
    return { userID };
  }

  throw response;
});

const fetchContacts = createAsyncThunk<IContact[], void, ThunkApiConfig>(
  "contacts/fetchContacts",
  async () => {
    const response = await service.fetch();
    if (response instanceof Success) {
      return response.data;
    }

    throw response;
  }
);

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addContact.pending, (s) => {
      s.isAdding = true;
    });
    builder.addCase(addContact.rejected, (s) => {
      s.isAdding = false;
    });
    builder.addCase(addContact.fulfilled, onAddContactFulfilled);

    builder.addCase(addFromFacebook.pending, (s) => {
      s.isAdding = true;
    });
    builder.addCase(addFromFacebook.rejected, (s) => {
      s.isAdding = false;
    });
    builder.addCase(addFromFacebook.fulfilled, (s) => {
      s.isAdding = false;
    });

    builder.addCase(deleteContact.pending, (s) => {
      s.isDeleting = true;
    });
    builder.addCase(deleteContact.rejected, (s) => {
      s.isDeleting = false;
    });
    builder.addCase(deleteContact.fulfilled, onDeleteContactFulfilled);

    builder.addCase(fetchContacts.pending, (s) => {
      s.isFetching = true;
    });
    builder.addCase(fetchContacts.rejected, (s) => {
      s.isFetching = false;
    });
    builder.addCase(fetchContacts.fulfilled, onFetchContactsFulfilled);
  },
});

function onAddContactFulfilled(
  state: IContactsState,
  action: { payload: AddContactResponse }
) {
  state.isAdding = false;
  const copy = state.contacts.slice();
  copy.push(action.payload.contact);
  copy.sort((a, b) =>
    a.userName.toLowerCase().localeCompare(b.userName.toLowerCase())
  );
  state.contacts = copy;
}

function onDeleteContactFulfilled(
  state: IContactsState,
  action: { payload: DeleteContactResponse }
) {
  state.contacts = state.contacts.filter((c) => c.id !== action.payload.userID);
}

function onFetchContactsFulfilled(
  state: IContactsState,
  action: { payload: IContact[] }
) {
  state.isFetching = false;
  state.contacts = action.payload;
}

export type { IContact } from "services/ContactService";
export const { reducer } = contactsSlice;
export { addContact, addFromFacebook, deleteContact, fetchContacts };
