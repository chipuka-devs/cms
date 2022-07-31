import { notification } from "antd";

export const success = (message, description) =>
  notification.success({
    message,
    description,
    placement: "topRight",
    duration: 2.5,
    className: "border-b-4 border-green-600",
  });

export const error = (message, description) =>
  notification.error({
    message,
    description,
    placement: "topRight",
    duration: 2.5,
    className: "border-b-4 border-red-500",
  });
