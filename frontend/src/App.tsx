import { RouterProvider } from "react-router-dom";
import { routers } from "./routes";

export default function App() {
  return <RouterProvider router={routers} />;
}
