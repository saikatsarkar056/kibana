/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import { i18n } from '@kbn/i18n';
import { FormRow } from '../../../../../shared_imports';

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
    ></FormRow>
  );
};
