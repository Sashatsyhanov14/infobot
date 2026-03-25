module.exports = {
  apps: [
    {
      name: 'bot4',
      script: 'npm',
      args: 'start',
      cwd: './bot',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
      },
    },
  ],
};
