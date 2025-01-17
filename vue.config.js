const path = require( "path" );
const webpack = require( "webpack" );

function resolve ( dir )
{
  return path.join( __dirname, dir );
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve( 'src' )
      }
    },
    plugins: [
      new webpack.DefinePlugin( {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify( true )
      } )
    ]
  },
  lintOnSave: false,
  publicPath: "./",
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  chainWebpack: ( config ) =>
  {
    config.module.rule( "svg" ).exclude.add( resolve( "src/icons" ) ).end();
    config.module
      .rule( "icons" )
      .test( /\.svg$/ )
      .include.add( resolve( "src/icons" ) )
      .end()
      .use( "svg-sprite-loader" )
      .loader( "svg-sprite-loader" )
      .options( {
        symbolId: "icon-[name]",
      } )
      .end();
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      importScripts: [
        "https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js",
      ],
      navigateFallback: "/",
      navigateFallbackDenylist: [ /\/api\// ],
    },
  },
};
