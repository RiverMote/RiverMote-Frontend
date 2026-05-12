/* Centralized polling intervals for various data types */

export const POLLING = {
    // Sensor samples update every 15 minutes
    samplesMs: 15 * 60 * 1000,
    // Device list/health checks follow the same pace
    devicesHealthMs: 15 * 60 * 1000,
    // Command queue updates can be more frequent than sensor data
    commandsMs: 60 * 1000,
} as const;
