import { GraphQLScalarType } from "graphql";
import {
    ClassType,
    Field,
    InputType,
    ObjectType,
} from "type-graphql";

@InputType()
export class PaginationParamsInput {
    @Field() from: number = 0;
    @Field() to: number = 10;
}

export function PaginationResponse<T>(
    _Tdata: ClassType<T> | GraphQLScalarType | String | Number | Boolean
) {
    @ObjectType({ isAbstract: true })
    abstract class PaginationResponseClass {
        @Field((type) => [_Tdata])
        data: T[];

        @Field()
        total: number;

        constructor({ total, data }: PaginationResponseClass) {
            this.total = total;
            this.data = data;
        }
    }
    return PaginationResponseClass;
}
