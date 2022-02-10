import { MongoDBConnect } from "./common/mongodb";
import { logger } from "./util/logger";

async function testMongoDB() {
    logger.info('[test] mongodb connect');

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
    logger.info('[endTest] mongodb connect');

    return 0;
}

(async () => {
    logger.info('[initInfo] example info');
    logger.warn('[initWarn] example warn', {
        function: '[index.ts]',
        description: '[WARN] example',
    });
    logger.error('[initError] example error', {
        function: '[index.ts]',
        description: '[ERROR] example',
    });

    logger.info('[example-project] init project');

    const _ = await testMongoDB();

    logger.info('[example-project] end project');

    process.exit(0);
})();
