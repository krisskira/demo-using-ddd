import { DataSource } from "./database/database";

export enum APP_ENVIRONTMENTS {
    PRODUCTION = "PRODUCTION",
    DEVELOPMENT = "DEVELOPMENT",
};

export interface ServerContext  {
    dataSource: DataSource;
}