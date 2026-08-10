import { jsx as _jsx } from "react/jsx-runtime";
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { MediaProvider } from "media-react";
// import "./index.css";
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <MediaProvider apiKey={import.meta.env.VITE_PEXELS_API_KEY}>
//       <App />
//     </MediaProvider>
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MediaProvider } from "media-react";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(MediaProvider, { apiKey: import.meta.env.VITE_PEXELS_API_KEY, children: _jsx(App, {}) }) }));
