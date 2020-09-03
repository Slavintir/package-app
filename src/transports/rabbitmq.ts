import amqp, { Channel, ConsumeMessage } from 'amqplib';

import { EventPayload, EventListenerHandler, Event } from '../interfaces/app/amqp';
import { RabbitConfig } from 'src/interfaces/app';

export class RabbitMqTransport {
    private channel!: Channel;
    private listeners: Map<string, EventListenerHandler> = new Map();

    async listen(config: RabbitConfig = { host: 'localhost', port: 5672, reconnectTimeoutMs: 5000 }): Promise<void> {
        const address = `amqp://${config.host}:${config.port}`;
        const connection = await amqp.connect(address);
        if (!connection) {
            setTimeout(this.listen.bind(this, config), config.reconnectTimeoutMs);

            return;
        }
        
        this.channel = await connection.createChannel();
        console.log('Success connect to rabbit mq', { address });
    }

    async createQueue(queueName: string): Promise<void> {
        const answer = await this.channel.assertQueue(queueName, { durable: true });

        if (answer) {
            console.log('Created queue', { queueName });
        }
    }

    publish(queueName: string, event: Event): boolean {
        const jsonPayload: string = JSON.stringify(event);

        return this.channel.sendToQueue(queueName, Buffer.from(jsonPayload), { persistent: true });
    }

    async subscribe(queueName: string, eventName: string, handler: EventListenerHandler): Promise<void> {
        const key = this.createKey(queueName, eventName);
        this.listeners.set(key, handler);
        await this.channel.consume(queueName, this.messageReceiver);
        console.info('Subscribed on %s', key);
    }

    private async messageReceiver(message: ConsumeMessage | null): Promise<void> {
        if (!message) {
            return;
        }

        const event: Event = JSON.parse(message.content.toString());
        const handler = this.listeners.get(this.createKey(event.eventName));

        if (typeof handler === 'function') {
            return handler(event.payload, event.meta);
        }

        console.log('No processed event', { event });
    }

    /**
     * Concat queueName: name and eventName: SOME_EVENT_NAME to name[EVENT_SOME_EVENT_NAME]
     * @param queueName - Rabbit mq queue name
     * @param eventName - Event name form
     */
    private createKey(queueName: string = '', eventName: string = ''): string {
        return `${queueName}[EVENT_${eventName.toUpperCase()}]`;
    }
}
