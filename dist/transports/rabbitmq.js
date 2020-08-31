"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqTransport = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const errors_1 = require("src/errors");
class RabbitMqTransport {
    constructor() {
        this.queues = new Map();
    }
    async listen() {
        this.connection = await amqplib_1.default.connect('amqp://localhost');
    }
    publish(queue, message) {
        const channel = this.queues.get(queue);
        if (!channel) {
            throw new errors_1.UnexpectedError(`Query ${queue} not found`);
        }
        return channel.sendToQueue(queue, Buffer.from(message));
    }
    async createChannel(queue) {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queue, { durable: false });
        this.queues.set(queue, channel);
    }
}
exports.RabbitMqTransport = RabbitMqTransport;
//# sourceMappingURL=rabbitmq.js.map