import { STATUS_LABEL_MAP } from "./constants";

export const statusText = (status) => {
  return STATUS_LABEL_MAP[status] || "無資訊";
};
