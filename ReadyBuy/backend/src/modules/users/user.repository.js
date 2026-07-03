import User from "./user.model.js";

export const createUser = async (userData) => {
    return User.create(userData);
};

export const findUserByEmail = async (email) => {
    return User.findOne({ email }).select("+password");
};

export const findUserById = async (id) => {
    return User.findById(id);
};