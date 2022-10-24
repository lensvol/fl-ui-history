export default function isDeviceMemoryTooLowForMapping(): boolean {
  let memoryIsConstrained = false;
  try {
    if ("deviceMemory" in navigator) {
      // @ts-ignore
      const reportedMemory = navigator.deviceMemory;
      if (reportedMemory <= 2) {
        memoryIsConstrained = true;
      }
    }
  } catch (e) {
    // again, no-op is OK here
    console.error("Failed to get reported memory; continuing");
  }
  return memoryIsConstrained;
}
