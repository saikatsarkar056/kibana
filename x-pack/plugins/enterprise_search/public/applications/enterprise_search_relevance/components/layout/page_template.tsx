/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import { INFERENCE_ENDPOINTS_PLUGIN } from '../../../../../common/constants';
import { SetEnterpriseSearchRelevanceChrome } from '../../../shared/kibana_chrome';
import { EnterpriseSearchPageTemplateWrapper, PageTemplateProps } from '../../../shared/layout';
import { useEnterpriseSearchNav } from '../../../shared/layout';
import { SendEnterpriseSearchTelemetry } from '../../../shared/telemetry';

export const EnterpriseSearchRelevancePageTemplate: React.FC<PageTemplateProps> = ({
  children,
  pageChrome,
  pageViewTelemetry,
  ...pageTemplateProps
}) => {
  return (
    <EnterpriseSearchPageTemplateWrapper
      {...pageTemplateProps}
      solutionNav={{
        items: useEnterpriseSearchNav(),
        name: INFERENCE_ENDPOINTS_PLUGIN.NAME,
      }}
      setPageChrome={pageChrome && <SetEnterpriseSearchRelevanceChrome trail={pageChrome} />}
    >
      {pageViewTelemetry && (
        <SendEnterpriseSearchTelemetry action="viewed" metric={pageViewTelemetry} />
      )}
      {children}
    </EnterpriseSearchPageTemplateWrapper>
  );
};
