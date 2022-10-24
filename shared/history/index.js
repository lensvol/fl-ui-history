// import createBrowserHistory from 'history/createBrowserHistory';
import { createBrowserHistory } from "history";

// Here we are creating a history object that can be used both inside
// components and elsewhere. This allows us direct access to the history
// inside action creators, rather than requiring us to pass it in when
// a component dispatches it.
const history = createBrowserHistory();
export default history;
