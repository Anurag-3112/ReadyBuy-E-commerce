channel.consume(
    queue,
    async (msg) => {

        const order =
            JSON.parse(
                msg.content.toString()
            );

        console.log(
            "Analytics Updated"
        );

        channel.ack(msg);
    }
);