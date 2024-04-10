/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useCallback, useState } from 'react';
import { InferenceStatsResponse } from '@kbn/ml-plugin/public/application/services/ml_api_service/trained_models';
import type { InferenceAPIConfigResponse } from '@kbn/ml-trained-models-utils';
import { InferenceToModelIdMap } from '../application/components/mappings_editor/components/document_fields/fields';
import { deNormalize } from '../application/components/mappings_editor/lib';
import { useAppContext } from '../application/app_context';
import { useComponentTemplatesContext } from '../application/components/component_templates/component_templates_context';
import { State } from '../application/components/mappings_editor/types';
import { useDispatch } from '../application/components/mappings_editor/mappings_state_context';

interface InferenceModel {
  data: InferenceAPIConfigResponse[];
}

type DeploymentStatusType = Record<string, 'deployed' | 'not_deployed'>;

const getCustomInferenceIdMap = (
  deploymentStatsByModelId: DeploymentStatusType,
  models?: InferenceModel
) => {
  return models?.data.reduce<InferenceToModelIdMap>((inferenceMap, model) => {
    const inferenceId = model.model_id;
    const trainedModelId =
      'model_id' in model.service_settings ? model.service_settings.model_id : '';
    inferenceMap[inferenceId] = {
      trainedModelId,
      isDeployed: deploymentStatsByModelId[trainedModelId] === 'deployed',
      defaultInferenceEndpoint: false,
    };
    return inferenceMap;
  }, {});
};

export const useDetailsPageMappingsModelManagement = (state: State) => {
  const {
    plugins: { ml },
  } = useAppContext();

  const { api } = useComponentTemplatesContext();

  const { inferenceToModelIdMap } = state;
  const dispatch = useDispatch();

  const [pendingDeployments, setPendingDeployments] = useState<string[]>([]);

  const fetchInferenceModelsAndTrainedModelStats = useCallback(async () => {
    const inferenceModels = await api.getInferenceModels();
    const trainedModelStats = await ml?.mlApi?.trainedModels.getTrainedModelStats();

    return { inferenceModels, trainedModelStats };
  }, [api, ml]);

  const getTrainedModelStats = useCallback(
    (modelStats?: InferenceStatsResponse): DeploymentStatusType => {
      const deploymentStatsByModelId =
        modelStats?.trained_model_stats.reduce<DeploymentStatusType>((acc, modelStat) => {
          if (modelStat.model_id) {
            acc[modelStat.model_id] =
              modelStat?.deployment_stats?.state === 'started' ? 'deployed' : 'not_deployed';
          }
          return acc;
        }, {}) ?? {};

      return deploymentStatsByModelId;
    },
    []
  );

  const getDefaultInferenceIds = useCallback((deploymentStatsByModelId: DeploymentStatusType) => {
    return {
      elser_model_2: {
        trainedModelId: '.elser_model_2',
        isDeployed: deploymentStatsByModelId['.elser_model_2'] === 'deployed',
        defaultInferenceEndpoint: true,
      },
      e5: {
        trainedModelId: '.multilingual-e5-small',
        isDeployed: deploymentStatsByModelId['.multilingual-e5-small'] === 'deployed',
        defaultInferenceEndpoint: true,
      },
    };
  }, []);

  const fetchInferenceToModelIdMap = useCallback(async () => {
    const { inferenceModels, trainedModelStats } = await fetchInferenceModelsAndTrainedModelStats();

    const deploymentStatsByModelId = getTrainedModelStats(trainedModelStats);
    const defaultInferenceIds = getDefaultInferenceIds(deploymentStatsByModelId);
    const modelIdMap = getCustomInferenceIdMap(deploymentStatsByModelId, inferenceModels);

    dispatch({
      type: 'inferenceToModelIdMap.update',
      value: { inferenceToModelIdMap: { ...defaultInferenceIds, ...modelIdMap } },
    });
  }, [
    getDefaultInferenceIds,
    getTrainedModelStats,
    dispatch,
    fetchInferenceModelsAndTrainedModelStats,
  ]);

  const getInferenceIdsInPendingList = useCallback(() => {
    const denormalizedFields = deNormalize(state.fields);

    const inferenceIdsInPendingList: string[] = [];
    for (const field of Object.values(denormalizedFields)) {
      if (field.type === 'semantic_text' && field.inference_id) {
        inferenceIdsInPendingList.push(field.inference_id as string);
      }
    }

    return inferenceIdsInPendingList;
  }, [state.fields]);

  const getPendingDeployments = useCallback(() => {
    const inferenceIdsInPendingList = getInferenceIdsInPendingList();
    const notDeployedTrainedModelIds: string[] = [];

    if (inferenceIdsInPendingList.length > 0) {
      inferenceIdsInPendingList.forEach((inferenceId: string) => {
        const trainedModelId = inferenceToModelIdMap?.[inferenceId]?.trainedModelId ?? '';
        if (trainedModelId && !inferenceToModelIdMap?.[inferenceId]?.isDeployed) {
          notDeployedTrainedModelIds.push(trainedModelId);
        }
      });
    }

    return notDeployedTrainedModelIds;
  }, [getInferenceIdsInPendingList, inferenceToModelIdMap]);

  return {
    getPendingDeployments,
    fetchInferenceToModelIdMap,
    fetchInferenceModelsAndTrainedModelStats,
    pendingDeployments,
    setPendingDeployments,
  };
};
