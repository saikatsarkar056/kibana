/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React, { useCallback, useEffect } from 'react';

import {
  FieldConfig,
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
  mainDefaultValue: string | undefined;
  config: FieldConfig;
  options: SuperSelectOption[];
  'data-test-subj'?: string;
}

export const InferenceIdSelects = ({
  onChange,
  mainDefaultValue,
  config,
  options,
  'data-test-subj': dataTestSubj,
}: Props) => {
  const { form } = useForm({ defaultValue: { main: mainDefaultValue } });
  const { subscribe } = form;

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
