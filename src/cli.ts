import { UserInfoReader } from "./readers.ts";
import { Render } from "./render.ts";

const renderer = new Render();

const userInfo = new UserInfoReader("books.yaml");
const userData = await userInfo.read();

async function writeDist() {
  await Deno.mkdir("./dist", { recursive: true });

  await Promise.all([
    Deno.writeTextFile("./dist/quotes.html", renderer.quotes(userData.quotes)),
    Deno.writeTextFile("./dist/activity.html", renderer.activity()),
    Deno.writeTextFile("./dist/books.html", renderer.read(userData.read)),
  ]);

  await Deno.mkdir("./dist/css", { recursive: true });
  for await (const file of Deno.readDir("./src/css")) {
    await Deno.copyFile(`./src/css/${file.name}`, `./dist/css/${file.name}`);
  }
}

await writeDist();
