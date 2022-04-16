import "reflect-metadata";
import {
    Arg,
    Args,
    Ctx,
    Mutation,
    Publisher,
    PubSub,
    Query,
    Resolver,
    // Root,
    // Subscription,
} from "type-graphql";
import { ServerContext } from "../../interfaces";
import {
    UserPartialInput,
    UserInput,
    UserPaginatedResponse,
    UserRegisterResponse,
    UserResponse,
    UserEmailGenerateInput,
    UserUpdateFilterInput,
} from "../typeDef/user.typeDef";
import { PaginationParamsInput } from "../typeDef/filter.typeDef";
import { UserController } from "../../../domain/controllers/user.controller";
import { UserRepository } from "../../../domain/repositories";
import { User } from "../../../domain/entities";

@Resolver()
export class UserResolver {
    @Query(() => UserPaginatedResponse)
    async getUsers(
        @Ctx() context: ServerContext,
        @Arg("paginationParams", {
            nullable: true,
            defaultValue: {
                from: 0,
                to: 10,
            },
        })
        paginationParams: PaginationParamsInput,
        @Arg("filterBy", { nullable: true, defaultValue: {} })
        userFilterParams: UserPartialInput
    ): Promise<UserPaginatedResponse> {
        const userController = new UserController();
        const repository = context.dataSource.getRepository<User>(
            UserRepository.name
        );
        const users = await userController.read(
            repository!,
            userFilterParams,
            paginationParams
        );
        const result = new UserPaginatedResponse({
            data: users,
            total: users.length,
        });
        return result;
    }

    @Mutation(() => UserRegisterResponse)
    async createUser(
        @Ctx() context: ServerContext,
        @Args() user: UserInput,
        // @PubSub("USERS_DATA_CHANGED") publish: Publisher<User[]>
    ): Promise<UserRegisterResponse> {
        const userController = new UserController();
        const repository = context.dataSource.getRepository<User>(
            UserRepository.name
        );
        const result = await userController.create(user, repository!);
        // await publish([result]);
        return new UserRegisterResponse(result);
    }

    @Mutation(() => UserResponse, { nullable: true })
    async updateUser(
        @Ctx() context: ServerContext,
        @Arg("filterBy")
        filterBy: UserUpdateFilterInput,
        @Arg("user") user: UserPartialInput,
        // @PubSub("USERS_DATA_CHANGED") publish: Publisher<User[]>
    ): Promise<UserResponse | undefined> {
        const userController = new UserController();
        const repository = context.dataSource.getRepository<User>(
            UserRepository.name
        );
        const result = await userController.update(filterBy, user, repository!);
        if (result) {
            const user = new UserResponse(result);
            // await publish([user]);
            return user;
        }
        return undefined;
    }

    @Mutation(() => UserResponse, { nullable: true })
    async deleteUser(
        @Ctx() context: ServerContext,
        @Arg("user") user: UserPartialInput
    ): Promise<UserResponse | undefined> {
        const userController = new UserController();
        const repository = context.dataSource.getRepository<User>(
            UserRepository.name
        );
        const result = await userController.delete(user, repository!);
        return result ? new UserResponse(result) : undefined;
    }

    @Query(() => String)
    async generateEmail(
        @Ctx() context: ServerContext,
        @Arg("user") user: UserEmailGenerateInput
    ): Promise<String> {
        const userController = new UserController();
        const repository = context.dataSource.getRepository<User>(
            UserRepository.name
        );
        return await userController.generateEmail(user, repository!);
    }

    // @Subscription(() => [UserResponse], {
    //     topics: "USERS_DATA_CHANGED",
    //     nullable: true,
    // })
    // async usersNotifier(
    //     @Ctx() context: ServerContext,
    //     @Root() notificationPayload: User[]
    // ) {
    //     const userController = new UserController();
    //     const repository = context.dataSource.getRepository<User>(
    //         UserRepository.name
    //     );
    //     console.log("***-> notificationPayload", notificationPayload);
    //     return notificationPayload;
    // }
}
