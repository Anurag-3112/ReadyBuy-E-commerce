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

export const getUsers = async ({
    page = 1,
    limit = 10,
    search = "",
    role,
    status,
}) => {
    const query = {};

    if (search) {
        query.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    if (role) {
        query.role = role;
    }

    if (status) {
        query.status = status;
    }

    const skip = (page - 1) * limit;

    const [docs, totalDocs] =
        await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query),
        ]);

    return {
        docs,
        totalDocs,
        page,
        totalPages: Math.ceil(totalDocs / limit),
        hasNextPage:
            page * limit < totalDocs,
        hasPrevPage: page > 1,
    };
};

export const findUsers = async ({
    page = 1,
    limit = 10,
    search = "",
    role,
    status,
}) => {

    const query = {};

    if (search) {

        query.$or = [

            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },

        ];

    }

    if (role) {

        query.role = role;

    }

    if (status) {

        query.status = status;

    }

    const skip = (page - 1) * limit;

    const [docs, totalDocs] = await Promise.all([

        User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        User.countDocuments(query),

    ]);

    return {

        docs,

        totalDocs,

        page,

        totalPages: Math.ceil(
            totalDocs / limit
        ),

        hasNextPage:
            page * limit < totalDocs,

        hasPrevPage:
            page > 1,

    };

};

export const updateUserRole = (
    id,
    role
) => {

    return User.findByIdAndUpdate(

        id,

        { role },

        { new: true }

    );

};

export const updateUserStatus = (
    id,
    status
) => {

    return User.findByIdAndUpdate(

        id,

        { status },

        { new: true }

    );

};

export const deleteUser = (id) => {

    return User.findByIdAndDelete(id);

};