module.exports = {
  apps: [
    {
      name: 'photo-backend',
      script: 'server/index.js',
      cwd: '/apps/photo-v1/app',
      exec_mode: 'fork', // Mode fork au lieu de cluster
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
      },
      error_file: '/apps/photo-v1/app/logs/backend-error.log',
      out_file: '/apps/photo-v1/app/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'photo-frontend',
      script: 'node_modules/.bin/vite',
      cwd: '/apps/photo-v1/app',
      exec_mode: 'fork', // Mode fork au lieu de cluster
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
      },
      error_file: '/apps/photo-v1/app/logs/frontend-error.log',
      out_file: '/apps/photo-v1/app/logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
