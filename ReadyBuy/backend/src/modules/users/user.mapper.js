export const toUserResponse = (user) => ({
    id: user._id,

    name: user.name,

    email: user.email,

    role: user.role,

    isVerified: user.isVerified,

    createdAt: user.createdAt,
});