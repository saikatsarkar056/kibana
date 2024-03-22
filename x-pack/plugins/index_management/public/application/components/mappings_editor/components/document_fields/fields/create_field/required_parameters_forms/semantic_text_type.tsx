/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import React from 'react';
import { useComponentTemplatesContext } from '../../../../../../component_templates/component_templates_context';
import { PARAMETERS_OPTIONS, STANDARD } from '../../../../../constants';
import { getFieldConfig } from '../../../../../lib';
import { Field, FormRow, UseField } from '../../../../../shared_imports';
import { SelectOption, SuperSelectOption } from '../../../../../types';
import { InferenceIdSelects } from '../../../field_parameters/inference_id_selects';

export interface MapOptionsToSubOptions {
  [key: string]: {
    label: string;
    options: SuperSelectOption[] | SelectOption[];
  };
}

const fieldConfig = getFieldConfig('inference_id');
const analyzerOptions = PARAMETERS_OPTIONS.analyzer!;

const fieldOptions = [...analyzerOptions] as SuperSelectOption[];

export const SemanticTextRequiredParameters = () => {
  const { api } = useComponentTemplatesContext();
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
              onChange={async (value) => {
                const inferenceModels = await api.getInferenceModels();
                field.setValue(value);
              }}
              mainDefaultValue={STANDARD}
              subDefaultValue={STANDARD}
              config={fieldConfig}
              options={fieldOptions}
            />
          </div>
        )}
      </UseField>
    </FormRow>
  );
};
