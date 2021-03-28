import axios from "axios";
import path from "path";
import fs from "fs/promises";
import { WebAPIInspectResult, ApiBundleGenerator } from "typewags";

async function main(...args: string[]) {
  console.log(args);
  const response = await axios.get<WebAPIInspectResult>(
    // If you follow the example, you can get the definition json by the following request.
    args[2] || "http://localhost:5000/typewags"
  );
  const json = response.data;
  // Generate all of the definitions by a simple API.
  const generator = new ApiBundleGenerator(json);
  const declarationContent = generator.generateApiInterfaceBundle();
  await fs.writeFile(
    path.resolve(process.cwd(), "src/api/schema.ts"),
    declarationContent
  );
}

main(...process.argv)
  .then(() => {
    console.log("Generate API script done.");
  })
  .catch((e) => {
    console.error(e);
    console.error("Generate API script crashed!");
  });
