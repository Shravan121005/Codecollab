import { render } from "@testing-library/react";
import App from "../App";

jest.mock("../components/services/api", () => ({
  default: {},
}));

test("App renders without crashing", () => {
  render(<App />);
});