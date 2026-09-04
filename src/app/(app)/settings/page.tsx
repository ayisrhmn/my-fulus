import { AppInfo } from "./app-info";
import { SignOut } from "./sign-out";

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-xl font-semibold">Pengaturan</h1>
      <div className="space-y-2">
        <AppInfo />
        <SignOut />
      </div>
    </div>
  );
}
