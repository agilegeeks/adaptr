# ⚠️ This package has moved

`adaptr` has been renamed and moved to:

## `@reve/contract-adapter`

New repository:

https://github.com/Reve/contract-adapter

New npm package:

```bash
npm install @reve/contract-adapter

# Why the rename?

The original adaptr package was created to solve a specific API-boundary problem: translating backend JSON contracts into frontend-friendly models and translating them back when sending data to the server.

The new name, contract-adapter, better describes the package purpose: bidirectional DTO and API contract adaptation.

# Migration

Replace the package:

npm uninstall adaptr
npm install @reve/contract-adapter

Update imports:

- import Adapter from 'adaptr'
+ import Adapter from '@reve/contract-adapter'

The existing API remains compatible unless otherwise noted in the new package changelog.

# Maintenance status

This repository is now in maintenance mode.

No new features will be added here. Critical fixes may be accepted for a limited period, but all active development has moved to:

https://github.com/Reve/contract-adapter
