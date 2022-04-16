import mongoose from "mongoose";
import { BaseRepository } from "../../domain/repositories/base.repository";

export interface DataSource {
    init(): Promise<void>;
    getRepository<T>(name: string): BaseRepository<T> | undefined
}

export class DataSource {
    private _mongoose!: mongoose.Mongoose;
    private readonly _databaseUrl: string;
    private readonly _repositories: Record<string, BaseRepository<unknown>>;

    constructor({
        databaseURL,
        repositories,
    }: {
        repositories:BaseRepository<unknown>[];
        databaseURL: string;
    }) {
        this._databaseUrl = databaseURL;
        this._repositories = repositories.reduce((acc, repo) => {
            return {
                ...acc,
                ...this.repositoryFactory(repo),
            };
        }, {});
    }
   
    public async init(): Promise<void> {
        console.log("DataSource init");
        this._mongoose = await mongoose.connect(this._databaseUrl);
    }

    public getRepository<T>(name: string): BaseRepository<T> | undefined {
        return this._repositories[name] as BaseRepository<T>;
    };

    private repositoryFactory<T>(repository: BaseRepository<T>): Record<string, BaseRepository<T>> {
        return {
            [repository.name]: repository,
        };
    }
}
