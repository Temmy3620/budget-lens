import SettingsClient from "@/components/settings/settings-client";

export const metadata = {
	title: "設定 - YariKuru",
	description: "アプリケーションの管理と各種設定を行います",
};

export default function SettingsPage() {
	return <SettingsClient />;
}
