module.exports = {
    apps: [{
        name: 'booking-inca-trail',
        script: './node_modules/.bin/next',
        args: 'start -p 3000',
        cwd: '/root/projects/BookingIncaTRail',
        instances: 1,
        exec_mode: 'fork',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        min_uptime: '10s',
        max_restarts: 10,
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        error_file: '/root/logs/booking-inca-error.log',
        out_file: '/root/logs/booking-inca-out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true
    }]
}
    