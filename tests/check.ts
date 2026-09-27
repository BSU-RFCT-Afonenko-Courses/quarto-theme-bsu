import { copy } from "stdlib/fs";
import { dirname, fromFileUrl, join } from "stdlib/path";
const repo = dirname(dirname(fromFileUrl(import.meta.url)));
const work = await Deno.makeTempDir({prefix: "bsu-theme-"});
const quarto = Deno.env.get("QUARTO") || "quarto";
function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}
async function run(args: string[]) {
  const result = await new Deno.Command(quarto, {args, cwd: work, stdout: "piped", stderr: "piped"}).output();
  assert(result.success, new TextDecoder().decode(result.stdout) + new TextDecoder().decode(result.stderr));
}
async function files(path: string): Promise<string[]> {
  const result: string[] = [];
  for await (const entry of Deno.readDir(path)) {
    const item = join(path, entry.name);
    if (entry.isDirectory) result.push(...await files(item)); else result.push(item);
  }
  return result;
}
try {
  const packageFiles = await files(join(repo, "_extensions/bsu-theme"));
  assert(!packageFiles.some(p => /\.(lua|js|ts)$/.test(p)), "Тема должна содержать только оформление и ресурсы");
  const manifest = await Deno.readTextFile(join(repo, "_extensions/bsu-theme/_extension.yml"));
  assert(!/filters:|pre-render:|post-render:|shortcodes:/.test(manifest), "Тема не должна подключать поведение");
  await copy(join(repo, "examples/course"), work, {overwrite: true});
  await run(["add", repo, "--no-prompt"]);
  await run(["render", "--fail-if-warnings"]);
  for (const name of ["index", "slides"]) {
    const html = await Deno.readTextFile(join(work, "_site", `${name}.html`));
    assert(html.includes("БГУ"), `Не собран пример ${name}`);
  }
  const cssPaths = (await files(join(work, "_site"))).filter(p => p.endsWith(".css"));
  const css = (await Promise.all(cssPaths.map(p => Deno.readTextFile(p)))).join("\n");
  assert(css.includes("--bsu-navy") && css.includes("--course-accent"), "Потеряны CSS-переменные бренда и компонентов");
  console.log("ПРОЙДЕНО: отдельная установка, HTML, Reveal.js, CSS-переменные, отсутствие исполняемого поведения темы");
} finally {
  await Deno.remove(work, {recursive: true});
}
