/** Attachment mounting standards used across machines and attachments. */
export const plateLabels: Record<string, string> = {
  "toro-dingo": "Mini skid steer plate (Toro Dingo style)",
  "rippa-mini": "RIPPA proprietary mini-loader plate",
  "universal-ssl": "Universal skid steer quick-attach (SSQA, ISO 24410)",
  "excavator-qc": "Excavator quick coupler (pin-on / mechanical)",
  "pin-on": "Pin-on",
};
export const plateOptions = Object.entries(plateLabels).map(([value, label]) => ({ label, value }));
