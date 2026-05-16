import { defineNitroConfig } from 'nitropack/config'
import { resolve } from 'node:path'

export default defineNitroConfig({
  srcDir: 'src',
  output: {
    dir: '../../dist/apps/backend'
  },
  imports: false,
  experimental: {
    websocket: true,
  },
  alias: {
    '@org/shared-schema': resolve(__dirname, '../../libs/shared/schema/src/index.ts'),
  },
})
