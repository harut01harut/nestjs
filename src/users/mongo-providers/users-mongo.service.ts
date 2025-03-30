import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "../dtos/create-user.dto";

@Injectable()
export class UsersMongoService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ){}

    public async createUser(createUserDto: CreateUserDto) {
        const newUser = new this.userModel(createUserDto);
        
        return await newUser.save();
    }

    public async findById(id: string) {
        const newUser = await this.userModel.findById(id);
        
        return newUser;
    }
}