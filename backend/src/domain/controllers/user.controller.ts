import {
    changeEmailDomain,
    getDomain,
    userEmailBuilder,
} from "../../helpers/email.builder";
import { ObjectDeleteUndefinedValues } from "../../helpers/object.extension";
import { User } from "../entities";
import { UserRepository } from "../repositories";

export class UserController {
    async create(
        user: Omit<User, "id" | "createdAt" | "updatedAt" | "email" | "active">,
        userRepository: UserRepository
    ): Promise<User> {
        const email = await this.generateEmail(user, userRepository);
        const result = await userRepository.create({
            ...user,
            email,
            active: true,
        });
        return result;
    }

    async read(
        userRepository: UserRepository,
        filterBy: Partial<User>,
        pagination: {
            from: number;
            to: number;
        }
    ): Promise<User[]> {
        return await userRepository.find(filterBy, pagination);
    }

    async update(
        filterBy: Partial<Pick<User, "id" | "email" | "identificationNumber">>,
        data: Partial<User>,
        userRepository: UserRepository
    ): Promise<User | undefined> {
        const _query = ObjectDeleteUndefinedValues(filterBy);
        const _data = ObjectDeleteUndefinedValues(data);
        // Regenerate email if firstname or lastname is changed
        if (data?.firstname ?? data?.lastname) {
            const user = await userRepository.findOne(_query);
            if (!user) return undefined;
            const email = await this.generateEmail(
                {
                    firstname: data?.firstname ?? user?.firstname,
                    lastname: data?.lastname ?? user?.lastname,
                    jobCountry: data?.jobCountry ?? user?.jobCountry,
                },
                userRepository
            );
            _data.email = email;
        } else if (data?.jobCountry) {
            const user = await userRepository.findOne(_query);
            if (!user) return undefined;
            _data.email = changeEmailDomain(user?.email, data?.jobCountry);
        } else {
            delete _data.email;
        }

        // Delete fields not modificable
        delete _data.updatedAt;
        delete _data.createdAt;
        delete _data.id;
        delete _data.active;

        return await userRepository.update(_query, _data);
    }

    async delete(
        user: Partial<User>,
        userRepository: UserRepository
    ): Promise<User | undefined> {
        return await userRepository.delete(user);
    }

    async generateEmail(
        user: Pick<User, "firstname" | "lastname" | "jobCountry">,
        userRepository: UserRepository
    ): Promise<string> {
        let increment = -1;
        const users = await userRepository.find({
            firstname: user.firstname,
            lastname: user.lastname,
        });
        if (users.length > 0) {
            const [emailId] = users
                .map(
                    (u) =>
                        u.email.match(/\.\d+@/g)?.[0].replace(/(\.|@)/g, "") ??
                        `${increment}`
                )
                .sort((a, b) => b.localeCompare(a));
            increment = parseInt(emailId, 10) + 1;
        }
        return userEmailBuilder(user, increment);
    }
}
