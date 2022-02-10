import { ConnectOptions, MongoClient, MongoOptions } from "mongodb";
import faker from "@faker-js/faker";

import { logger } from "../util/logger";
import { sleep } from "../util/utils";

export class MongoDBConnect {
    private url;
    private client;

    constructor(url?: string) {
        this.url = url || 'mongodb://localhost:27017';
        this.client = new MongoClient(this.url, {
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
        } as ConnectOptions);
    }

    async openConnection(): Promise<MongoClient> {
        try {
            return await this.client.connect();
        } catch (error) {
            logger.error(`Error trying to connect with <${this.url}>`);
            throw error;
        }
    }

    async closeConnection(connection: MongoClient) {
        try {
            return await connection.close();
        } catch (error) {
            logger.error(`Error trying to close connection with <${this.url}>`);
            throw error;
        }
    }

    async collectionTest(dbName = 'test') {
        try {
            const db = this.client.db(dbName);
            const collection = db.collection('test_items');

            // await collection.drop();

            const items = await this.generateFakeTest();
            const insertedItens = await collection.insertMany(items);

            return { status: 'success', count: insertedItens.insertedCount };
        } catch (error: any) {
            const { message } = error;
            logger.error(`Error [MongoDBConnect][collectionTest] ${message}`);
            throw error;
        }
    }

    async generateFakeTest() {
        logger.info('Generate Fake Test');
        const items = [];

        const randomIntFromInterval = (min: number, max: number) => { 
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        for (let i = 0; i < 100; i++) {
            let events: Array<any> = [];
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            let newDay = {
                id: faker.datatype.uuid(),
                timestamp_day: faker.date.past(),
                cat: faker.random.word(),
                owner: {
                    email: faker.internet.email(firstName, lastName),
                    firstName,
                    lastName,
                },
                events,
            };
            for (let j = 0; j < randomIntFromInterval(1, 6); j++) {
                let newEvent = {
                    timestamp_event: faker.date.past(),
                    weight: randomIntFromInterval(14,16),
                }
                newDay.events.push(newEvent);
            }
            logger.info(`push item ${newDay.id}`, {
                id: newDay.id,
                email: newDay.owner.email,
            });
            items.push(newDay);
            await sleep(100);
        }

        return items;
    }
}
