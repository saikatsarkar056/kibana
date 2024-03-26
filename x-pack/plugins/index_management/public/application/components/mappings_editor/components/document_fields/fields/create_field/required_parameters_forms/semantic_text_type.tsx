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
import { FormRow, UseField } from '../../../../../shared_imports';
import { SuperSelectOption } from '../../../../../types';
import { ModelIdSelects } from '../../../field_parameters/model_id_selects';
import { ReferenceFieldSelects } from '../../../field_parameters/reference_field_selects';

const fieldConfigReferenceField = getFieldConfig('reference_field');
const fieldConfigModelId = getFieldConfig('model_id');

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

  const modelIdOptions: SuperSelectOption[] =
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
      <UseField path="reference_field" config={fieldConfigReferenceField}>
        {(field) => (
          <div className="mappingsEditor__selectSemanticTextReferenceField">
            <ReferenceFieldSelects onChange={field.setValue} />
          </div>
        )}
      </UseField>

      <UseField path="model_id" config={fieldConfigModelId}>
        {(field) => (
          <div className="mappingsEditor__selectSemanticTextModelId">
            <ModelIdSelects
              onChange={field.setValue}
              mainDefaultValue={'my-elser-model-1'}
              config={fieldConfigModelId}
              options={modelIdOptions}
            />
          </div>
        )}
      </UseField>
    </FormRow>
  );
};
