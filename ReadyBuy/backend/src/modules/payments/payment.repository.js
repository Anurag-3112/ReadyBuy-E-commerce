import Payment from "./payment.model.js";


export const createPayment = (
    paymentData
) =>
    Payment.create(
        paymentData
    );


export const findPaymentByOrderId = (
    orderId
) =>
    Payment.findOne({
        order: orderId,
    });


export const findPaymentByGatewayOrderId = (
    gatewayOrderId
) =>
    Payment.findOne({
        gatewayOrderId,
    });


export const findPaymentByGatewayPaymentId = (
    gatewayPaymentId
) =>
    Payment.findOne({
        gatewayPaymentId,
    });


export const markPaymentAsPaid =
    (
        paymentId,
        {
            gatewayPaymentId,
            gatewaySignature,
        } = {}
    ) =>
        Payment.findOneAndUpdate(
            {
                _id: paymentId,

                status: {
                    $ne: "PAID",
                },
            },

            {
                $set: {
                    status:
                        "PAID",

                    ...(gatewayPaymentId && {
                        gatewayPaymentId,
                    }),

                    ...(gatewaySignature && {
                        gatewaySignature,
                    }),

                    paidAt:
                        new Date(),
                },
            },

            {
                new: true,
            }
        );


export const updatePayment = (
    paymentId,
    updateData
) =>
    Payment.findByIdAndUpdate(
        paymentId,
        updateData,
        {
            new: true,

            runValidators: true,
        }
    );