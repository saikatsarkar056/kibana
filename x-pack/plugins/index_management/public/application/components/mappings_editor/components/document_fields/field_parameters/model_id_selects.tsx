/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React, { useCallback, useEffect, useState } from 'react';

import { useComponentTemplatesContext } from '../../../../component_templates/component_templates_context';
import { getFieldConfig } from '../../../lib';
import {
  FieldHook,
  Form,
  FormDataProvider,
  SuperSelectField,
  UseField,
  useForm,
} from '../../../shared_imports';
import { SuperSelectOption } from '../../../types';
interface Props {
  onChange(value: unknown): void;
  'data-test-subj'?: string;
}

export const ModelIdSelects = ({ onChange, 'data-test-subj': dataTestSubj }: Props) => {
  const { form } = useForm({ defaultValue: { main: 'elser' } });
  const { subscribe } = form;
  const { api } = useComponentTemplatesContext();
  const [inferenceModels, setInferenceModels] = useState<any>([]);

  const fieldConfigModelId = getFieldConfig('model_id');
  const modelIdOptions: SuperSelectOption[] =
    inferenceModels?.data?.map((model: any) => ({
      value: model.model_id,
      inputDisplay: model.model_id,
    })) || [];

  useEffect(() => {
    const fetchInferenceModels = async () => {
      const models = await api.getInferenceModels();
      setInferenceModels(models);
    };

    fetchInferenceModels();
  }, [api]);

  useEffect(() => {
    const subscription = subscribe((updateData) => {
      const formData = updateData.data.internal;
      const value = formData.main;
      onChange(value);
    });

    return subscription.unsubscribe;
  }, [subscribe, onChange]);

  const onMainValueChange = useCallback(async (mainValue: unknown) => {}, []);

  const renderSelect = (field: FieldHook, opts: SuperSelectOption[]) => {
    return (
      <SuperSelectField
        field={field}
        euiFieldProps={{ options: opts }}
        data-test-subj={dataTestSubj}
      />
    );
  };

  return (
    <Form form={form}>
      <FormDataProvider pathsToWatch="main">
        {({ main }) => {
          return (
            <EuiFlexGroup>
              <EuiFlexItem>
                <UseField path="main" config={fieldConfigModelId} onChange={onMainValueChange}>
                  {(field) => renderSelect(field, modelIdOptions)}
                </UseField>
              </EuiFlexItem>
            </EuiFlexGroup>
          );
        }}
      </FormDataProvider>
    </Form>
  );
};
