import "./styles.css";
import AsyncApiStandalone from "@asyncapi/react-component/browser/standalone";
import "@asyncapi/react-component/styles/default.min.css";
import { specMock } from "./asyncAPI";

 

async function main() {
  const app = document.getElementById("app");
  const container = document.createElement("div");
  container.id = "asyncapi";
  app.appendChild(container);

  await AsyncApiStandalone.render({
     schema: {
        url: 'http://localhost:8000/src/specs.yaml',
        options: { method: "GET", mode: "cors" },
      },
    config: {
      show: {
        sidebar: true,
      },
    },
  }, container);
}

main()