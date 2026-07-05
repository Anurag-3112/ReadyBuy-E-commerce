export const toUserResponse = (user) => ({
    id: user._id,

    name: user.name,

    email: user.email,

    role: user.role,

    status: user.status,

    avatar: user.avatar,

    phone: user.phone,

    lastLogin: user.lastLogin,

    isVerified: user.isVerified,

    createdAt: user.createdAt,
});