<div align="center">

<h1> vite-plugin-angular </h1>
A minimal plug-n-play plugin to support Angular applications building with Vite.

[![][img.release]][link.release]
[![][img.license]][link.license]

![][img.node]
![][img.npm]
![][img.downloads]

[![][img.banner]][link.npm]

</div>

<h2>Table of Contents</h2>

- [Install](#install)
- [How it works](#how-it-works)

## Install

1. Install the plugin:

```shell
yarn add @smoosee/vite-plugin-angular -D
```

2. Add the plugin

```ts
import { defineConfig } from 'vite';
import VitePluginAngular from '@smoosee/vite-plugin-angular';

export default defineConfig({
    plugins: [VitePluginAngular()],
});
```

[img.release]: https://img.shields.io/github/actions/workflow/status/smoosee/vite-plugin-angular/release.yml?logo=github&label=release
[img.license]: https://img.shields.io/github/license/smoosee/vite-plugin-angular?logo=github
[img.node]: https://img.shields.io/node/v/@smoosee/vite-plugin-angular?logo=node.js&logoColor=white&labelColor=339933&color=grey&label=
[img.npm]: https://img.shields.io/npm/v/@smoosee/vite-plugin-angular?logo=npm&logoColor=white&labelColor=CB3837&color=grey&label=
[img.downloads]: https://img.shields.io/npm/dt/@smoosee/vite-plugin-angular?logo=docusign&logoColor=white&labelColor=purple&color=grey&label=
[img.banner]: https://nodei.co/npm/@smoosee/vite-plugin-angular.png
[link.release]: https://github.com/smoosee/vite-plugin-angular/actions/workflows/release.yml
[link.license]: https://github.com/smoosee/vite-plugin-angular/blob/master/LICENSE
[link.npm]: https://npmjs.org/package/@smoosee/vite-plugin-angular
