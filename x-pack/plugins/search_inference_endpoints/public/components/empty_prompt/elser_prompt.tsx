/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import { EuiButton, EuiCard } from '@elastic/eui';

import { i18n } from '@kbn/i18n';

interface ElserPromptProps {
  addEndpointLabel: string;
  setIsInferenceFlyoutVisible: (value: boolean) => void;
}
export const ElserPrompt: React.FC<ElserPromptProps> = ({
  addEndpointLabel,
  setIsInferenceFlyoutVisible,
}) => (
  <EuiCard
    display="plain"
    hasBorder
    textAlign="left"
    data-test-subj="elserPromptForEmptyState"
    description={i18n.translate(
      'xpack.searchInferenceEndpoints.inferenceEndpoints.addEmptyPrompt.elserDescription',
      {
        defaultMessage:
          "ELSER is a sparse vector NLP model trained by Elastic for semantic search. Recommended for English language.",
      }
    )}
    title={i18n.translate(
      'xpack.searchInferenceEndpoints.inferenceEndpoints.addEmptyPrompt.elserTitle',
      {
        defaultMessage: 'ELSER',
      }
    )}
    footer={
      <EuiButton iconType="plusInCircle" onClick={() => setIsInferenceFlyoutVisible(true)}>
        {addEndpointLabel}
      </EuiButton>
    }
  />
);
