import { Provider } from "react-redux";
import store from "./store";

import "./app.scss";

const App = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default App;
