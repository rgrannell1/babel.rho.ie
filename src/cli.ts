import { UserInfoReader } from "./readers.ts";
import { Render } from "./render.ts";

const renderer = new Render();

const userInfo = new UserInfoReader("books.yaml");
const userData = await userInfo.read();

await Deno.mkdir("./dist", { recursive: true });
await Deno.writeTextFile("./dist/quotes.html", renderer.quotes(userData.quotes));
await Deno.writeTextFile("./dist/activity.html", renderer.activity());
await Deno.writeTextFile("./dist/books.html", renderer.read(userData.read));

await Deno.mkdir("./dist/css", { recursive: true });
for await (const file of Deno.readDir("./css")) {
  await Deno.copyFile(`./css/${file.name}`, `./dist/css/${file.name}`);
}
