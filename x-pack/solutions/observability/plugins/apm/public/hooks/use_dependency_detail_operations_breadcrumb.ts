/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import { castArray } from 'lodash';
import { useBreadcrumb } from '../context/breadcrumbs/use_breadcrumb';
import { useAnyOfApmParams } from './use_apm_params';
import { useApmRouter } from './use_apm_router';
import type { Breadcrumb } from '../context/breadcrumbs/context';

export function useDependencyDetailOperationsBreadcrumb(
  extraBreadCrumbs: Breadcrumb | Breadcrumb[] = []
) {
  const {
    query: {
      dependencyName,
      rangeFrom,
      rangeTo,
      refreshInterval,
      refreshPaused,
      environment,
      kuery,
      comparisonEnabled,
    },
  } = useAnyOfApmParams('/dependencies/operations', '/dependencies/operation');

  const apmRouter = useApmRouter();

  useBreadcrumb(
    () => [
      {
        title: i18n.translate('xpack.apm.dependencyDetailOperations.breadcrumbTitle', {
          defaultMessage: 'Operations',
        }),
        href: apmRouter.link('/dependencies/operations', {
          query: {
            dependencyName,
            rangeFrom,
            rangeTo,
            refreshInterval,
            refreshPaused,
            environment,
            kuery,
            comparisonEnabled,
          },
        }),
      },
      ...castArray(extraBreadCrumbs),
    ],
    [
      apmRouter,
      comparisonEnabled,
      dependencyName,
      environment,
      extraBreadCrumbs,
      kuery,
      rangeFrom,
      rangeTo,
      refreshInterval,
      refreshPaused,
    ]
  );
}
