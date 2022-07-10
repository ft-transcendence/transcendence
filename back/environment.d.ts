// Setup multiple environments
// Prod // Build

declare namespace NodeJS {
    export interface ProcessEnv {
        MYSQL_DB_HOST?: string;
        PORT?: string;
        ENVIRONMENT: Environment;
    }
    export type Environment = 'DEVELOPMENT' | 'PRODUCTION';
}