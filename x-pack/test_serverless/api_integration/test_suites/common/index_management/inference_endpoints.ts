/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../../ftr_provider_context';

const API_BASE_PATH = '/api/index_management';

export default function ({ getService }: FtrProviderContext) {
  const supertest = getService('supertest');
  const log = getService('log');
  const ml = getService('ml');
  const inferenceId = 'my-elser-model';
  const taskType = 'sparse_embedding';
  const service = 'elser';

  describe('Inference endpoints', function () {
    let modelsBeforeTest: any[] = [];
    before(async () => {
      log.debug(`Creating inference endpoint`);
      try {
        const modelsInfo = await ml.api.getTrainedModelsES();
        modelsBeforeTest = modelsInfo.trained_model_configs.map((model: any) => model.model_id);
        await ml.api.createInferenceEndpoint(inferenceId, taskType, {
          service,
          service_settings: {
            num_allocations: 1,
            num_threads: 1,
          },
        });
      } catch (err) {
        log.debug('[Setup error] Error creating inference endpoint');
        throw err;
      }
    });

    after(async () => {
      // Cleanup inference endpoints created for testing purposes
      try {
        log.debug(`Deleting inference endpoint`);
        await ml.api.deleteInferenceEndpoint(inferenceId, taskType);

        const modelsInfo = await ml.api.getTrainedModelsES();
        let modelsAfterTest = modelsInfo.trained_model_configs.map((model: any) => model.model_id);

        modelsAfterTest = modelsAfterTest.filter((model: any) => !modelsBeforeTest.includes(model));
        for (const modelId of modelsAfterTest) {
          await ml.api.deleteTrainedModelES(modelId);
        }
      } catch (err) {
        log.debug('[Cleanup error] Error deleting inference endpoint');
        throw err;
      }
    });

    describe('get inference endpoints', () => {
      it('returns the existing inference endpoints', async () => {
        const { body: inferenceEndpoints } = await supertest
          .get(`${API_BASE_PATH}/inference/all`)
          .set('kbn-xsrf', 'xxx')
          .set('x-elastic-internal-origin', 'xxx')
          .expect(200);

        expect(inferenceEndpoints).to.be.ok();
        expect(inferenceEndpoints[0].model_id).to.eql(inferenceId);
      });
    });
  });
}
