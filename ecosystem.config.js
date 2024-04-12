module.exports = {
  apps: [
    {
      name: "app",
      script: "pm2 set pm2-logrotate:max_size 200M && node ./www/app.js",
      env_production: {
        NODE_ENV: "production",
      },
      error: './logs/err.log',
      instances: 3
    },
  ],
};
