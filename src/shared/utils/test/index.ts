import express, { Router } from 'express';
import errorHandler from '@interfaces/middlewares/error-handler';

class TestUtils {
  static mockPartial<T>(defaults: Partial<T> = {}): T {
    return <T>defaults;
  }

  static createApp(router: Router, basePath: string = '/api') {
    const app = express();
    app.use(express.json());
    app.use(basePath, router);
    app.use(errorHandler);

    return app;
  }
}

export default TestUtils;
