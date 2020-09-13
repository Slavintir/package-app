"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqTransport = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const src_1 = require("src");
class RabbitMqTransport {
    constructor() {
        this.listeners = new Map();
    }
    async listen(config = { host: 'localhost', port: 5672, reconnectTimeoutMs: 5000 }) {
        const address = `amqp://${config.host}:${config.port}`;
        const connection = await amqplib_1.default.connect(address);
        if (!connection) {
            setTimeout(this.listen.bind(this, config), config.reconnectTimeoutMs);
            return;
        }
        this.channel = await connection.createChannel();
        console.log('Success connect to rabbit mq', { address });
    }
    async createQueue(queueName) {
        const answer = await this.channel.assertQueue(queueName, { durable: true });
        if (answer) {
            console.log('Created queue', { queueName });
        }
    }
    publish(queueName, event) {
        const jsonPayload = JSON.stringify(event);
        return this.channel.sendToQueue(queueName, Buffer.from(jsonPayload), { persistent: true });
    }
    async subscribe(queueName, eventName, handler) {
        const key = this.createKey(eventName);
        this.listeners.set(key, handler);
        await this.channel.consume(queueName, this.messageReceiver.bind(this));
        console.info('Subscribed on %s', key);
    }
    async messageReceiver(message) {
        if (!message) {
            return;
        }
        const event = JSON.parse(message.content.toString());
        const handler = this.listeners.get(this.createKey(event.eventName));
        if (typeof handler === 'function') {
            console.debug('Received event', Object.assign({}, event));
            this.channel.ack(message);
            await handler(event.payload, { initiator: src_1.App.getConfig().serviceName, date: new Date() }).catch((err) => {
                console.error('Fail handel event', Object.assign({}, event), err);
                throw err;
            });
        }
        console.log('No processed event', { event });
    }
    /**
     * Concat queueName: name and eventName: SOME_EVENT_NAME to name[EVENT_SOME_EVENT_NAME]
     * @param queueName - Rabbit mq queue name
     * @param eventName - Event name form
     */
    createKey(eventName = '') {
        return `[EVENT_${eventName.toUpperCase()}]`;
    }
}
exports.RabbitMqTransport = RabbitMqTransport;
//# sourceMappingURL=rabbitmq.js.map