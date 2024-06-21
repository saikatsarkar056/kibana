/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React from 'react';
import { RenderEndpointProps } from './render_endpoint';
import { ModelBadge } from './model_badge';

interface ServiceSettings {
  model_id: string;
  url: string;
}

export const RenderOpenAI: React.FC<RenderEndpointProps> = ({ endpoint }) => {
  const serviceSettings = endpoint.service_settings as ServiceSettings;

  return (
    <EuiFlexGroup gutterSize="s" direction="column">
      <EuiFlexItem grow={false}>
        <strong>{endpoint.model_id}</strong>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFlexGroup gutterSize="s">
          {serviceSettings?.model_id && (
            <EuiFlexItem grow={false}>
              <ModelBadge model={serviceSettings.model_id} />
            </EuiFlexItem>
          )}
          {serviceSettings?.url && <EuiFlexItem grow={false}>{serviceSettings.url}</EuiFlexItem>}
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
