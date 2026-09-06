  import type { FileNode } from "@edujed/jedsvelted-ui/ui";

// Sample data — mirrors the shape returned by the Personal-AI-Assistent API.
export const sampleTree: FileNode[] = [
    { name: "package.json", path: "package.json", is_dir: false },
    { name: "tsconfig.json", path: "tsconfig.json", is_dir: false },
    {
      name: "src",
      path: "src",
      is_dir: true,
      children: [
        { name: "App.svelte", path: "src/App.svelte", is_dir: false },
        { name: "main.ts", path: "src/main.ts", is_dir: false },
        {
          name: "pages",
          path: "src/pages",
          is_dir: true,
          children: [
            {
              name: "About.svelte",
              path: "src/pages/About.svelte",
              is_dir: false,
            },
            {
              name: "Home.svelte",
              path: "src/pages/Home.svelte",
              is_dir: false,
            },
          ],
        },
        {
          name: "stores",
          path: "src/stores",
          is_dir: true,
          children: [
            {
              name: "theme.store.ts",
              path: "src/stores/theme.store.ts",
              is_dir: false,
            },
          ],
        },
      ],
    },
    {
      name: "docs",
      path: "docs",
      is_dir: true,
      children: [
        { name: "README.md", path: "docs/README.md", is_dir: false },
        { name: "guide.md", path: "docs/guide.md", is_dir: false },
      ],
    },
  ];
