/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import React, { useEffect, useState } from 'react';
import { useComponentTemplatesContext } from '../../../../../../component_templates/component_templates_context';
import { getFieldConfig } from '../../../../../lib';
import { Field, FormRow, UseField } from '../../../../../shared_imports';
import { SuperSelectOption } from '../../../../../types';
import { InferenceIdSelects } from '../../../field_parameters/inference_id_selects';

const fieldConfig = getFieldConfig('inference_id');

export const SemanticTextRequiredParameters = () => {
  const { api } = useComponentTemplatesContext();
  const [inferenceModels, setInferenceModels] = useState<any>([]);

  useEffect(() => {
    const fetchInferenceModels = async () => {
      const models = await api.getInferenceModels();
      setInferenceModels(models);
    };

    fetchInferenceModels();
  }, [api]);

  const fieldOptions: SuperSelectOption[] =
    inferenceModels?.data?.map((model: any) => ({
      value: model.model_id,
      inputDisplay: model.model_id,
    })) || [];

  return (
    <FormRow
      title={
        <h3>
          {i18n.translate('xpack.idxMgmt.mappingsEditor.semanticText.modelInferenceTitle', {
            defaultMessage: 'Model Inference',
          })}
        </h3>
      }
    >
      <UseField
        path="reference_field"
        config={getFieldConfig('reference_field')}
        component={Field}
      />

      <UseField path="inference_id" config={fieldConfig}>
        {(field) => (
          <div className="mappingsEditor__selectSemanticText">
            <InferenceIdSelects
              onChange={field.setValue}
              mainDefaultValue={'my-elser-model'}
              config={fieldConfig}
              options={fieldOptions}
            />
          </div>
        )}
      </UseField>
    </FormRow>
  );
};
