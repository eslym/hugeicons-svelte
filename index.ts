/*
 * Generate svelte components from hugeicons, hugeicons only have support for react,
 * so we generate the svelte components from the react components.
 *
 * https://hugeicons.com/
 */
import { resolve } from "path";
import { toKebabCase } from "js-convert-case";
import { name, repository, version } from "./package.json";

const destPath = resolve(import.meta.dir, "dist");

await Bun.plugin({
  name: "hijack-hugeicons",
  setup: async ({ onLoad }) => {
    onLoad(
      {
        filter:
          /node_modules\/hugeicons-react\/dist\/esm\/create-hugeicon-component.js$/,
      },
      async (_) => {
        return {
          exports: {
            default(name: string, definitions: any) {
              return {
                name,
                definitions,
              };
            },
          },
          loader: "object",
        };
      }
    );
  },
});

const icons: Record<string, any> = await import(
  resolve(
    import.meta.dir,
    "node_modules/hugeicons-react/dist/esm/icons/index.js"
  )
);

await Bun.$`rm -rf ${destPath}`;
await Bun.$`mkdir -p ${destPath}`;

const template = await Bun.file(resolve(import.meta.dir, "Hugeicon.svelte")).text();

const index = [];

for (const [name, data] of Object.entries(icons)) {
  const lines = [];
  for (const child of data.definitions) {
    const attrs: any = [];
    for (const key in child[1]) {
      if (key === "key") continue;
      attrs.push(`${toKebabCase(key)}="${Bun.escapeHTML(child[1][key])}"`);
    }
    lines.push(`<${child[0]} ${attrs.join(" ")} />`);
  }
  const code = template.replace("<!-- ICONS -->", lines.join("\n"));
  await Bun.write(resolve(destPath, `icons/${name}.svelte`), code);
  index.push(`export { default as ${name} } from "./icons/${name}.svelte";`);
}

await Bun.write(resolve(destPath, "index.mjs"), index.join("\n"));

await Bun.write(
  resolve(destPath, "package.json"),
  JSON.stringify(
    {
      name,
      repository,
      version,
      exports: {
        svelte: "./index.mjs",
      },
    },
    null,
    4
  )
);