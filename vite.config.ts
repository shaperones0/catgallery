import { resolve } from 'path'

export default {
    root:  resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'src', 'public'),
    build: {
        outDir: '../docs'
    },
    base: '/docs/'
}
