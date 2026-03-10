import { createLogger, defineConfig, loadEnv, UserConfig } from 'vite';
import chalk from 'chalk';

export default defineConfig(({ command, mode }) => {
    const logger = createLogger();

    const currentTime = new Date();
    const version = `${currentTime.getFullYear()}.${currentTime.getMonth()}.${currentTime.getDate()}.${currentTime.getHours()}.${currentTime.getMinutes()}`;
    logger.info(`App Version: ${chalk.blue(version)}`);

    const env = loadEnv(mode, `${process.cwd()}/config`, 'VAR_');

    const commonConfig: UserConfig = {
        root: `${process.cwd()}/src`,
        publicDir: `${process.cwd()}/assets`,
        base: './',
        define: {
            '__VERSION__': JSON.stringify(version),
            '__DEBUG__': JSON.stringify(env.VAR_DEBUG),
        },
    };

    if (command === 'serve') {
        return {
            ...commonConfig,
            server: {
                open: true,
            }
        };
    } else {
        return {
            ...commonConfig,
            build: {
                emptyOutDir: true,
                outDir: `${process.cwd()}/dist`,
                sourcemap: true,
                license: true,
                rollupOptions: {
                    output: {
                        manualChunks: {
                            three: ['three'],
                        }
                    }
                }
            },
        };
    }
});
