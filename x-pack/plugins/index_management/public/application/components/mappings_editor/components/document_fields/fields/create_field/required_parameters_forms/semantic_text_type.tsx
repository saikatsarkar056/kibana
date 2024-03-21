/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import { getFieldConfig } from '../../../../../lib';
import { Field, FormRow, UseField } from '../../../../../shared_imports';
import { PARAMETERS_OPTIONS, STANDARD } from '../../../../../constants';
import { InferenceIdSelects } from '../../../field_parameters/inference_id_selects';
import { SuperSelectOption, SelectOption } from '../../../../../types';

export interface MapOptionsToSubOptions {
  [key: string]: {
    label: string;
    options: SuperSelectOption[] | SelectOption[];
  };
}

const ANALYZER_OPTIONS = PARAMETERS_OPTIONS.analyzer!;
const fieldConfig = getFieldConfig('inference_id');
const fieldConfigWithLabel = fieldConfig;
const analyzerOptions = ANALYZER_OPTIONS;

const fieldOptions = [...analyzerOptions] as SuperSelectOption[];

export const SemanticTextRequiredParameters = () => {
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

      <UseField path="inference_id" config={fieldConfigWithLabel}>
        {(field) => (
          <div className="mappingsEditor__selectSemanticText">
            <InferenceIdSelects
              onChange={field.setValue}
              mainDefaultValue={STANDARD}
              subDefaultValue={STANDARD}
              config={fieldConfigWithLabel}
              options={fieldOptions}
            />
          </div>
        )}
      </UseField>
    </FormRow>
  );
};
