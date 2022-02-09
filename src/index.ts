import { MongoDBConnect } from "./common/mongodb";
import { logger } from "./util/logger";

async function testMongoDB() {
    logger.info('test mongodb connect');

    const client = new MongoDBConnect();
    const connect = await client.openConnection();

    const result: {
        status: string, 
        count: number,
    } = await client.collectionTest();

    if (result.status == 'success') {
        logger.info(`{ status: ${result.status}, count: ${result.count} }`);
    }

    await client.closeConnection(connect);
    logger.info('end test mongodb connect');
}

(async () => {
    logger.info('--- example info ---');
    logger.warn('--- example warn ---');
    logger.error('--- example error ---');

    logger.info('init project');

    await testMongoDB();

    logger.info('end project');

    process.exit(0);
})();
