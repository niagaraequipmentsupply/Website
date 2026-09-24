/** Bumped by Payload afterChange/afterDelete hooks so the in-process site-content memo drops stale data. */
let version = 0;
export const bumpContentVersion = () => { version++; };
export const contentVersion = () => version;
