const webpack = require('webpack')


plugins: [
  new webpack.ProvidePlugin({
    'window.Quill': 'quill/dist/quill.js',
    'Quill': 'quill/dist/quill.js'
  })
]
