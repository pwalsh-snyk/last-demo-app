/*
 * Copyright (c) 2014-2021 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 * Newly modified file on Mar-1
 */

require('./lib/startup/validateDependencies')().then(() => {
  const server = require('./server')
  server.start()
})
