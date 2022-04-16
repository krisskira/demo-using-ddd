import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { UserRepository } from "../../../domain/repositories";
import { User } from "../../../domain/entities";
import { ServerContext } from "../../interfaces";

@Resolver()
export class PingPongResolver {
    @Query(() => String)
    async ping(@Ctx() context: ServerContext, @Arg("message") message: string) {
        const result = context.dataSource.getRepository<User>(UserRepository.name)?.find({});
        return message ?? "pong";
    }
}