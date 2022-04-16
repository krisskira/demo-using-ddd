import mongoose from "mongoose";
import { ObjectDeleteUndefinedValues } from "../../helpers/object.extension";

export interface BaseRepository<T> {
    name: string;
    create(data: T): Promise<T>;
    find(
        query: any,
        pagination: {
            from: number;
            to: number;
        }
    ): Promise<T[]>;
    findOne(query: any): Promise<T>;
    update(query: any, data: T): Promise<T>;
    delete(query: any): Promise<T>;
}

export abstract class BaseRepository<T> {
    protected _model: mongoose.Model<T>;

    constructor(name: string, model: mongoose.Model<T>) {
        this._model = model;
        this.name = name;
    }

    public async create(data: Omit<T, "updatedAt" | "createdAt">): Promise<T> {
        const created = await this._model.create(data);
        return created.toObject({ virtuals: true }) as T;
    }

    public async find(
        query: Partial<T>,
        pagination = {
            from: 0,
            to: 10,
        }
    ): Promise<T[]> {
        const _query = ObjectDeleteUndefinedValues(
            this.factoryToAddIdKey(query)
        );
        const found = await this._model
            .find(_query)
            .skip(pagination.from)
            .limit(pagination.to);
        return found.map((item: any) => item.toObject({ virtuals: true }));
    }

    public async findOne(query: Partial<T>): Promise<T> {
        const _query = ObjectDeleteUndefinedValues(
            this.factoryToAddIdKey(query)
        );
        const found = await this._model.findOne(_query);
        return found?.toObject({ virtuals: true }) as T;
    }

    public async update(
        query: Partial<T>,
        data: Partial<T>
    ): Promise<T | undefined> {
        const _query = ObjectDeleteUndefinedValues(
            this.factoryToAddIdKey(query)
        );
        const _data = ObjectDeleteUndefinedValues(data);
        const updated = await this._model.findOneAndUpdate(
            _query,
            {
                $set: _data,
            },
            {
                new: true,
            }
        );
        return updated?.toObject({ virtuals: true }) as T;
    }

    public async delete(query: Partial<T>): Promise<T | undefined> {
        const _query = ObjectDeleteUndefinedValues(
            this.factoryToAddIdKey(query)
        );
        const deleted = await this._model.findOneAndDelete(_query);
        return deleted?.toObject({ virtuals: true }) as T;
    }

    private factoryToAddIdKey<T>(
        arg: T & { id?: string }
    ): T & { _id?: string; id?: string } {
        return {
            _id: arg?.id,
            ...arg,
        };
    }
}
