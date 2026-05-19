"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.setGlobalPrefix("api");
    const port = Number(process.env.NEST_PORT ?? process.env.PORT ?? 3001);
    const host = process.env.NEST_HOST ?? "127.0.0.1";
    await app.listen(port, host);
}
void bootstrap();
//# sourceMappingURL=main.js.map