const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: {
      index: './index.html'
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
      "~": path.resolve(__dirname, 'node_modules')
    },
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true, // 是否只转译
          //设置自定义转换器,TypeScript 可以将 TS 源码编译成 JS 代码，自定义转换器插件则可以让你定制生成的代码。比如删掉代码里的注释、改变变量的名字、将类转换为函数等等
          //TypeScript 将 TS 代码编译到 JS 的功能，其实也是通过内置的转换器实现的，从 TS 2.3 开始，TS 将此功能开放，允许开发者编写自定义的转换器。
          getCustomTransformers: () => {
            before: [tsImportPluginFactory({
              "libraryName": 'antd',
              "libraryDirectory": 'es',
              "style": 'css'
            })]
          },
          compilerOptions: {
            module: 'es2015'
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // 将 CSS 作为一个 style 标签插入到 HTML 中
          {
            loader: 'css-loader', // 处理 CSS 中的 import 和 url
            options: {
              importLoaders: 0
            }
          },
          {
            loader: 'postcss-loader', // 给 CSS 添加厂商前缀
            options: {
              plugins: [
                require('autoprefixer')
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1 个 rem 代表 75px
              remPrecesion: 8 // 计算精度保留8位小数
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 0
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecesion: 8
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.(jpg|png|gif|svg|jpeg)$/,
        use: [
          'url-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}