import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';

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
  ] = await Promise.all([
    Device.getUptimeAsync(),
    Platform.OS === 'android' ? Device.getMaxMemoryAsync() : null,
    Application.getInstallationTimeAsync(),
    Platform.OS === 'android' ? Application.getLastUpdateTimeAsync() : null,
  ]);
  return {
    uptime,
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
