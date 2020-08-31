import amqp, { Connection, Channel } from 'amqplib';
import { UnexpectedError } from 'src/errors';

export class RabbitMqTransport {
    private connection!: Connection;
    private queues: Map<string, Channel> = new Map();

    async listen(): Promise<void> {
        this.connection = await amqp.connect('amqp://localhost');
    }

    publish(queue: string, message: string): boolean {
        const channel = this.queues.get(queue);

        if (!channel) {
            throw new UnexpectedError(`Query ${queue} not found`);
        }
        return channel.sendToQueue(queue, Buffer.from(message));
    }

    async createChannel(queue: string): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queue, { durable: false });
        this.queues.set(queue, channel);
    }
}
