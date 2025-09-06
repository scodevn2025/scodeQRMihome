// Mijia API - Main export file

export * from './types';
export * from './auth';
export * from './api';
export * from './device';

// Re-export main classes for convenience
export { MijiaAuth, mijiaAuth } from './auth';
export { MijiaAPI, mijiaAPI } from './api';
export { MijiaDeviceWrapper, createMijiaDevice, createMijiaDeviceByName } from './device';
