import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Location from 'expo-location';

export const getDeviceStatus = async (): Promise<Record<string, any>> => {
  const {
    brand,
    manufacturer,
    modelId,
    modelName,
    designName,
    productName,
    deviceYearClass,
    totalMemory,
    supportedCpuArchitectures,
    osName,
    osVersion,
    osBuildId,
    osInternalBuildId,
    osBuildFingerprint,
    platformApiLevel,
    deviceName,
  } = Device;
  const {
    nativeApplicationVersion,
    nativeBuildVersion,
    applicationName,
    applicationId,
  } = Application;
  const [
    uptime,
    maxMemory,
    appInstalledAt,
    appUpdatedAt,
    locationProviderStatus,
  ] = await Promise.all([
    Device.getUptimeAsync(),
    Device.getMaxMemoryAsync(),
    Application.getInstallationTimeAsync(),
    Application.getLastUpdateTimeAsync(),
    Location.getProviderStatusAsync(),
  ]);
  return {
    uptime,
    locationProviderStatus,
    deviceName,
    app: {
      appInstalledAt,
      appUpdatedAt,
      nativeApplicationVersion,
      nativeBuildVersion,
      applicationName,
      applicationId,
    },
    device: {
      brand,
      manufacturer,
      modelId,
      modelName,
      designName,
      productName,
      deviceYearClass,
      platformApiLevel,
    },
    hardware: {
      totalMemory,
      maxMemory,
      supportedCpuArchitectures,
    },
    os: {
      osName,
      osVersion,
      osBuildId,
      osInternalBuildId,
      osBuildFingerprint,
    },
  };
};
