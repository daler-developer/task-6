import { createRoot } from "react-dom/client";
import App from "./components/App";
import "antd/dist/antd.css";
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(<App />);
