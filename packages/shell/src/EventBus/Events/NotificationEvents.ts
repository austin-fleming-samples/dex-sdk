import { Notification } from "@<REDACTED>/uikit";
import { BaseEvent } from "../BaseEvent";

export const ShowNotificationEvent = Symbol("ShowNotificationEvent");

export class ShowNotification extends BaseEvent<Notification> {
  constructor(notification: Notification) {
    super(ShowNotificationEvent, notification);
  }
}
