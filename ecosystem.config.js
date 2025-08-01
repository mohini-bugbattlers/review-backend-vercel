module.exports = {
    apps : [{
      name   : "api",
      script : "./index.js",
      log : "./logs/api.log",
      env_production : {
        NODE_ENV: "production"
      }
    }]
  }