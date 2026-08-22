/**
 * ユーザーが現在アクティブなサブスクリプション（またはトライアル）を保持しているか判定します。
 * @param status サブスクリプションステータス ('trialing', 'active' 等)
 */
export function hasActiveSubscription(
	status: string | null | undefined,
): boolean {
	if (!status) return false;
	return status === "trialing" || status === "active";
}
