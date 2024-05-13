/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect } from 'react';

import { useValues } from 'kea';

import { APPLICATIONS_PLUGIN } from '../../../../common/constants';

import { KibanaLogic } from '../kibana';

import {
  useGenerateBreadcrumbs,
  useSearchBreadcrumbs,
  useEnterpriseSearchApplicationsBreadcrumbs,
  useAnalyticsBreadcrumbs,
  useEnterpriseSearchContentBreadcrumbs,
  useEnterpriseSearchRelevanceBreadcrumbs,
  useAiSearchBreadcrumbs,
  useElasticsearchBreadcrumbs,
  useAppSearchBreadcrumbs,
  useWorkplaceSearchBreadcrumbs,
  BreadcrumbTrail,
  useSearchExperiencesBreadcrumbs,
  useVectorSearchBreadcrumbs,
} from './generate_breadcrumbs';
import {
  aiSearchTitle,
  analyticsTitle,
  appSearchTitle,
  elasticsearchTitle,
  enterpriseSearchContentTitle,
  enterpriseSearchRelevanceTitle,
  searchExperiencesTitle,
  searchTitle,
  vectorSearchTitle,
  workplaceSearchTitle,
} from './generate_title';

/**
 * Helpers for setting Kibana chrome (breadcrumbs, doc titles) on React view mount
 * @see https://github.com/elastic/kibana/blob/main/src/core/public/chrome/chrome_service.tsx
 *
 * Example usage (don't forget to i18n.translate() page titles!):
 *
 * <SetAppSearchPageChrome trail={['Engines', 'Example Engine Name, 'Curations']} />
 * Breadcrumb output: Enterprise Search > App Search > Engines > Example Engine Name > Curations
 * Title output: Curations - Example Engine Name - Engines - App Search - Elastic
 *
 * <SetWorkplaceSearchChrome />
 * Breadcrumb output: Enterprise Search > Workplace Search
 * Title output: Workplace Search - Elastic
 */

interface SetChromeProps {
  trail?: BreadcrumbTrail;
}

export const SetSearchChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = searchTitle(title);

  const crumbs = useGenerateBreadcrumbs(trail);
  const breadcrumbs = useSearchBreadcrumbs(crumbs);

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail.join('|')]);

  return null;
};

export const SetAnalyticsChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = analyticsTitle(title);

  const crumbs = useGenerateBreadcrumbs(trail);
  const breadcrumbs = useAnalyticsBreadcrumbs(crumbs);

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail]);

  return null;
};

export const SetElasticsearchChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = elasticsearchTitle(title);

  const crumbs = useGenerateBreadcrumbs(trail);
  const breadcrumbs = useElasticsearchBreadcrumbs(crumbs);

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail]);

  return null;
};

export const SetAppSearchChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = appSearchTitle(title);

  const crumbs = useGenerateBreadcrumbs(trail);
  const breadcrumbs = useAppSearchBreadcrumbs(crumbs);

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail]);

  return null;
};

export const SetAiSearchChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = aiSearchTitle(title);

  const crumbs = useGenerateBreadcrumbs(trail);
  const breadcrumbs = useAiSearchBreadcrumbs(crumbs);

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail]);

  return null;
};

export const SetWorkplaceSearchChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = workplaceSearchTitle(title);

  const crumbs = useGenerateBreadcrumbs(trail);
  const breadcrumbs = useWorkplaceSearchBreadcrumbs(crumbs);

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail]);

  return null;
};

export const SetEnterpriseSearchContentChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = enterpriseSearchContentTitle(title);

  const crumbs = useGenerateBreadcrumbs(trail);
  const breadcrumbs = useEnterpriseSearchContentBreadcrumbs(crumbs);

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail]);

  return null;
};

export const SetEnterpriseSearchRelevanceChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = enterpriseSearchRelevanceTitle(title);

  const crumbs = useGenerateBreadcrumbs(trail);
  const breadcrumbs = useEnterpriseSearchRelevanceBreadcrumbs(crumbs);

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail]);

  return null;
};

export const SetSearchExperiencesChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = searchExperiencesTitle(title);

  const crumbs = useGenerateBreadcrumbs(trail);
  const breadcrumbs = useSearchExperiencesBreadcrumbs(crumbs);

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail]);

  return null;
};

export const SetEnterpriseSearchApplicationsChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = appSearchTitle(title);

  const breadcrumbs = useEnterpriseSearchApplicationsBreadcrumbs(
    useGenerateBreadcrumbs([APPLICATIONS_PLUGIN.NAV_TITLE, ...trail])
  );

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail]);

  return null;
};

export const SetVectorSearchChrome: React.FC<SetChromeProps> = ({ trail = [] }) => {
  const { setBreadcrumbs, setDocTitle } = useValues(KibanaLogic);

  const title = reverseArray(trail);
  const docTitle = vectorSearchTitle(title);

  const breadcrumbs = useVectorSearchBreadcrumbs(useGenerateBreadcrumbs(trail));

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setDocTitle(docTitle);
  }, [trail]);

  return null;
};

// Small util - performantly reverses an array without mutating the original array
const reverseArray = (array: string[]) => array.slice().reverse();
