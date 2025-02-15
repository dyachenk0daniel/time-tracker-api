import { DateUtils, ObjectUtils, StringUtils } from '@shared/utils';
import { CreateUser, User, UserResponse } from './types';

export class UserModel {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string | null;

    constructor({
        id = StringUtils.generateUUID(),
        name,
        email,
        password,
        createdAt = DateUtils.getCurrentDateISOString(),
        updatedAt = null,
    }: Partial<User> & Pick<User, 'name' | 'email' | 'password'>) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    patch(updatedData: Partial<User>) {
        Object.assign(this, updatedData);

        return this;
    }

    toResponse(): UserResponse {
        return ObjectUtils.omit(this, ['password']);
    }

    toCreation(): CreateUser {
        return ObjectUtils.pick(this, ['name', 'email', 'password']);
    }

    toPlain(): User {
        return JSON.parse(JSON.stringify(this));
    }
}
