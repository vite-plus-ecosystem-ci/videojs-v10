import { defineConfig } from 'vite-plus';
import type { UserConfig as PackUserConfig } from 'vite-plus/pack';

import { type PackageBuildMode, packageBuildConfig, packageBuildModes } from '../../build/pack.ts';
import { cachedTaskInputs, packageTestTask, workspaceTaskDependencies } from '../../build/task.ts';
import packageJson from './package.json' with { type: 'json' };

const createPackConfig = (mode: PackageBuildMode): PackUserConfig => ({
  ...packageBuildConfig(mode, 'neutral'),
  entry: {
    index: './src/core/index.ts',
    'media-tracks': './src/core/media-tracks/index.ts',
    dom: './src/dom/index.ts',
    'dom/audio-host/index': './src/dom/audio-host/index.ts',
    'dom/media-host/index': './src/dom/media-host/index.ts',
    'dom/video-host/index': './src/dom/video-host/index.ts',
    'dom/custom-media-element/index': './src/dom/custom-media-element/index.ts',
    'dom/media-played-ranges/index': './src/dom/media-played-ranges/index.ts',
    'dom/dash/index': './src/dom/dash/index.ts',
    'dom/dash/server': './src/dom/dash/server.ts',
    'dom/hls-js/index': './src/dom/hls-js/index.ts',
    'dom/native-hls/index': './src/dom/native-hls/index.ts',
    'dom/cloudflare/index': './src/dom/cloudflare/index.ts',
    'dom/shaka/index': './src/dom/shaka/index.ts',
    'dom/spotify/index': './src/dom/spotify/index.ts',
    'dom/tiktok/index': './src/dom/tiktok/index.ts',
    'dom/twitch/index': './src/dom/twitch/index.ts',
    'dom/vimeo/index': './src/dom/vimeo/index.ts',
    'dom/youtube/index': './src/dom/youtube/index.ts',
    'dom/mux/index': './src/dom/mux/index.ts',
    'dom/mux/source/index': './src/dom/mux/source/index.ts',
    'dom/google-cast/index': './src/dom/google-cast/index.ts',
  },
  define: {
    __DEV__: mode === 'dev' ? 'true' : 'false',
    __PLAYER_VERSION__: JSON.stringify(packageJson.version),
  },
});

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'vp pack',
        dependsOn: workspaceTaskDependencies(),
        input: cachedTaskInputs,
        output: ['dist/**'],
      },
      'test:ci': packageTestTask(),
    },
  },
  define: {
    __DEV__: 'true',
    __PLAYER_VERSION__: JSON.stringify('10.0.0-beta.25'),
  },
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-0-0-rc-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    // Vitest v4 compatibility: keep separate Vite servers for inline projects.
    // Remove when plugins and config hooks can run once for shared projects.
    // https://release-v1-0-0-rc-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#inline-projects-share-the-vite-server-by-default
    sharedViteServer: false,
    projects: [
      {
        extends: true,
        test: {
          name: 'media',
          include: ['src/core/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'media/dom',
          include: ['src/dom/**/*.test.ts'],
          environment: 'jsdom',
        },
      },
    ],
  },
  pack: packageBuildModes.map(createPackConfig),
});
