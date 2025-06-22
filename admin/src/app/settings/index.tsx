import { SettingsPanel } from "@/components/settings-panel"

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
        <SettingsPanel />
        </div>
    </div>
  )
}
