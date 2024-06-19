/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiBadge } from '@elastic/eui';
import React from 'react';

interface TaskTypeProps {
  type: string;
}

export const TaskType: React.FC<TaskTypeProps> = ({ type }) => {
  if (type != null) {
    return <EuiBadge color="hollow">{type}</EuiBadge>;
  }

  return null;
};
