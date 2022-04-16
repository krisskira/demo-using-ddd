import "reflect-metadata";
import { UserRepository } from "./domain/repositories";
import { BaseRepository } from "./domain/repositories/base.repository";
import { APP_ENVIRONTMENTS } from "./infraestructure/interfaces";
import { DataSource } from "./infraestructure/database/database";
import { Server } from "./infraestructure/server/server";
import {config} from "dotenv";

async function bootstrap() {
    config();
    const {
        ENVIORNMENT = APP_ENVIRONTMENTS.DEVELOPMENT,
        PORT = "8000",
        DATABASE: databaseURL = "",
    } = process.env;

    const userRepository = new UserRepository() as BaseRepository<unknown>;

    const dataSource = new DataSource({
        databaseURL,
        repositories: [
            userRepository 
        ]
    });

    await dataSource.init();

    new Server({
        env: <APP_ENVIRONTMENTS>ENVIORNMENT,
        port: parseInt(`${PORT}`, 10),
        dataSource
    });
}

bootstrap();