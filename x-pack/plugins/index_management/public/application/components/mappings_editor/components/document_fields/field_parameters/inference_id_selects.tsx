/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect, useCallback } from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import {
  useForm,
  Form,
  UseField,
  SuperSelectField,
  FieldConfig,
  FieldHook,
  FormDataProvider,
} from '../../../shared_imports';
import { SelectOption, SuperSelectOption } from '../../../types';
import { useComponentTemplatesContext } from '../../../../component_templates/component_templates_context';

type Options = SuperSelectOption[] | SelectOption[];

interface Props {
  onChange(value: unknown): void;
  mainDefaultValue: string | undefined;
  subDefaultValue: string | undefined;
  config: FieldConfig;
  options: Options;
  'data-test-subj'?: string;
}

export const InferenceIdSelects = ({
  onChange,
  mainDefaultValue,
  subDefaultValue,
  config,
  options,
  'data-test-subj': dataTestSubj,
}: Props) => {
  const { form } = useForm({ defaultValue: { main: mainDefaultValue, sub: subDefaultValue } });
  const { subscribe } = form;

  useEffect(() => {
    const subscription = subscribe((updateData) => {
      const formData = updateData.data.internal;
      const value = formData.sub ? formData.sub : formData.main;
      onChange(value);
    });

    return subscription.unsubscribe;
  }, [subscribe, onChange]);

  const { api } = useComponentTemplatesContext();

  const onMainValueChange = useCallback(
    async (mainValue: unknown) => {
      const inferenceModels = await api.getInferenceModels();
      // console.log('+++++++++++++++');
      // console.log(inferenceModels);
      // console.log('==============');
      // console.log(options);
    },
    [api]
  );

  const renderSelect = (field: FieldHook, opts: Options) => {
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
                <UseField path="main" config={config} onChange={onMainValueChange}>
                  {(field) => renderSelect(field, options)}
                </UseField>
              </EuiFlexItem>
            </EuiFlexGroup>
          );
        }}
      </FormDataProvider>
    </Form>
  );
};
