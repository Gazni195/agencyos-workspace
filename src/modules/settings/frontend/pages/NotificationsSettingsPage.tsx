import { Switch } from "@/shared/frontend/components/ui/switch";
import { useSettingsStore } from "@/modules/settings/frontend/store/settingsStore";
import { notificationEvents } from "@/modules/settings/types";

export function NotificationsSettingsPage() {
  const notificationPrefs = useSettingsStore((s) => s.notificationPrefs);
  const toggleNotificationPref = useSettingsStore((s) => s.toggleNotificationPref);

  return (
    <div className="surface-card divide-y divide-border overflow-hidden">
      {notificationEvents.map((event) => (
        <div key={event} className="flex items-center justify-between gap-3 p-4">
          <p className="text-sm font-medium">{event}</p>
          <Switch
            checked={notificationPrefs[event] ?? false}
            onCheckedChange={() => toggleNotificationPref(event)}
            aria-label={event}
          />
        </div>
      ))}
    </div>
  );
}
