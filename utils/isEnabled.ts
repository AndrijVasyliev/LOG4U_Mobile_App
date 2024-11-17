import { UserData } from '../hooks/userData';

export const isProfileEnabled = (userData: UserData): boolean =>
  userData?.type === 'Driver' ||
  userData?.type === 'OwnerDriver' ||
  userData?.type === 'CoordinatorDriver';
export const isLoadsEnabled = (userData: UserData): boolean =>
  userData?.type === 'Driver' ||
  userData?.type === 'OwnerDriver' ||
  userData?.type === 'CoordinatorDriver';
export const isLoadsListEnabled = (userData: UserData): boolean =>
  userData?.type === 'Owner' || userData?.type === 'OwnerDriver';
export const isTrucksEnabled = (userData: UserData): boolean =>
  userData?.type === 'Owner' ||
  userData?.type === 'OwnerDriver' ||
  userData?.type === 'Coordinator' ||
  userData?.type === 'CoordinatorDriver';
export const isMapEnabled = (userData: UserData): boolean =>
  userData?.type === 'Owner' ||
  userData?.type === 'OwnerDriver' ||
  userData?.type === 'Coordinator' ||
  userData?.type === 'CoordinatorDriver';
