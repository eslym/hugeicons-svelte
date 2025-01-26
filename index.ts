/*
 * Generate svelte components from hugeicons, hugeicons only have support for react,
 * so we generate the svelte components from the react components.
 *
 * https://hugeicons.com/
 */
import { resolve } from "path";
import { toKebabCase } from "js-convert-case";
import { name, repository } from "./package.json";

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

const dts = `import type { SVGAttributes } from 'svelte/elements';
export type IconProps = Omit<
  SVGAttributes<SVGElement>,
  'width' | 'height' | 'viewbox' | 'fill' | 'xmlns'
> & {
    size?: number | string;
};

`;

for (const [name, data] of Object.entries(icons)) {
  const filename = toKebabCase(name);
  const lines = [];
  const dts = [
    'import { Component } from "svelte";',
    'import { IconProps } from "../index";',
    `declare const ${name}: Component<IconProps, {}, "">;`,
    `export default ${name};`,
  ];
  for (const child of data.definitions) {
    const attrs: any = [];
    for (const key in child[1]) {
      if (key === "key") continue;
      attrs.push(`${toKebabCase(key)}="${Bun.escapeHTML(child[1][key])}"`);
    }
    lines.push(`<${child[0]} ${attrs.join(" ")} />`);
  }
  const code = template.replace("<!-- ICONS -->", lines.join("\n"));
  await Bun.write(resolve(destPath, `icons/${filename}.svelte`), code);
  await Bun.write(resolve(destPath, `icons/${filename}.svelte.d.ts`), dts.join("\n"));
  index.push(`export { default as ${name} } from "./icons/${filename}.svelte";`);
}

await Bun.write(resolve(destPath, "index.mjs"), index.join("\n"));
await Bun.write(resolve(destPath, "index.d.ts"), dts + index.join("\n"));

await Bun.$`cp README.md ${destPath}`;

const version = Bun.env.GITHUB_REF?.replace("refs/tags/v", "") ?? "0.0.0";

await Bun.write(
  resolve(destPath, "package.json"),
  JSON.stringify(
    {
      name,
      repository,
      version,
      exports: {
        types: "./index.d.ts",
        svelte: "./index.mjs",
      },
    },
    null,
    4
  )
);