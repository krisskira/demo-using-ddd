import { createServer } from "http";
import { WebSocketServer, Server as WSServer } from "ws";
import express from "express";
import { useServer } from "graphql-ws/lib/use/ws";
import { execute, subscribe } from "graphql";
import { ApolloServer } from "apollo-server-express";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
    UserInputError,
} from "apollo-server-core";
import { buildSchemaSync } from "type-graphql";
import { APP_ENVIRONTMENTS } from "../interfaces";
import { DataSource } from "../database/database";
import "./typeDef/enums.typeDef";
import { Validator } from "class-validator";

export class Server {
    private _expressApp = express();
    private _httpServer = createServer(this._expressApp);
    private _wsServer = new WebSocketServer({
        server: this._httpServer,
        path: "/graphql",
    });
    private _apolloServer!: ApolloServer;

    constructor({
        env,
        port,
        dataSource,
    }: {
        env: APP_ENVIRONTMENTS;
        port: number;
        dataSource: DataSource;
    }) {
        const schema = buildSchemaSync({
            resolvers: [__dirname + "/resolvers/**/*.resolver.ts"],
            validate: (args) => {
                if (!args) return;
                const validator = new Validator();
                const errors = validator.validateSync(args, {
                    enableDebugMessages: true,
                });
                if (errors.length > 0) {
                    throw new UserInputError(
                        "Invalid input",
                        errors.map(({ property, constraints }) => ({
                            property,
                            constraints,
                        }))
                    );
                }
            },
        });
        const serverCleanup = useServer(
            {
                schema,
                execute,
                subscribe,
                // onConnect: (ctx) => {
                //     console.log("Connect");
                // },
                // onSubscribe: (ctx, msg) => {
                //     console.log("Subscribe");
                // },
                // onNext: (ctx, msg, args, result) => {
                //     console.debug("Next");
                // },
                // onError: (ctx, msg, errors) => {
                //     console.error("Error");
                // },
                // onComplete: (ctx, msg) => {
                //     console.log("Complete");
                // },
            },
            this._wsServer
        );

        this._apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }) => ({
                req,
                res,
                dataSource,
            }),
            plugins: [
                env === APP_ENVIRONTMENTS.DEVELOPMENT
                    ? ApolloServerPluginLandingPageGraphQLPlayground()
                    : ApolloServerPluginLandingPageDisabled(),

                ApolloServerPluginDrainHttpServer({
                    httpServer: this._httpServer,
                }),
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                await serverCleanup.dispose();
                            },
                        };
                    },
                },
            ],
        });

        this._apolloServer.start().then(() => {
            this._apolloServer.applyMiddleware({
                app: this._expressApp,
                path: "/graphql",
                __internal_healthCheckPath: "/health",
                onHealthCheck: async (request) => {
                    return "OK";
                },
            });

            this._httpServer.listen(port, () => {
                console.log(
                    `🚀 [${new Date().toISOString()}] MODE: ${env} ` +
                        `| GRAPHQL: http://localhost:${port}${this._apolloServer.graphqlPath}`
                );
            });
        });
    }
}
