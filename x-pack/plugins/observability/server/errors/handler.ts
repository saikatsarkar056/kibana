/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ObservabilityError, SLOIdConflict, SLONotFound } from './errors';

export function getHTTPResponseCode(error: ObservabilityError): number {
  if (error instanceof SLONotFound) {
    return 404;
  }

  if (error instanceof SLOIdConflict) {
    return 409;
  }

  return 400;
}
