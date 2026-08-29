#!/bin/bash

# エラー発生時、未定義変数参照時、パイプラインエラー時に即座に終了
set -euo pipefail

# ==============================================================================
# 設定項目（プロジェクトに合わせて書き換えてください）
# ==============================================================================
PROJECT_ID="YOUR_GCP_PROJECT_ID"        # 例: my-budget-lens-project
SERVICE_NAME="budget-lens"              # Cloud Run のサービス名
REGION="asia-northeast1"                # デプロイ先リージョン (東京: asia-northeast1)
REPO_NAME="budget-lens-repo"            # Artifact Registry のリポジトリ名
IMAGE_NAME="budget-lens"                # コンテナイメージ名
PORT=8080                               # Cloud Run ポート

# 最低必要空き容量(GB)（ビルド失敗を防ぐための安全ライン）
REQUIRED_FREE_GB=8

# タグ（バージョン管理用: 年月日時分秒）
TAG="$(date +%Y%m%d-%H%M%S)"
AR_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:${TAG}"
LATEST_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:latest"

# ==============================================================================
# 環境変数設定
# ==============================================================================
# 1. Next.js ビルド時 (ブラウザ用公開環境変数)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
NEXT_PUBLIC_APP_URL="https://budget-lens-xxxxxxxxxx-an.a.run.app" # 独自ドメインまたは Cloud Run URL

# 2. サーバー実行時 (非公開・シークレット)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."

# ==============================================================================
# ユーティリティ関数
# ==============================================================================
need_space() {
  echo "🧮 ディスク空き容量チェック..."
  local avail_gb
  # macOS 前提: ルートパーティションの空き容量(GB)
  avail_gb=$(df -g / | awk 'NR==2{print $4}')
  echo "   空き容量: ${avail_gb}GB / 必要: ${REQUIRED_FREE_GB}GB"
  if [ "${avail_gb}" -lt "${REQUIRED_FREE_GB}" ]; then
    echo "❌ 空き容量不足です。クリーンアップを実行してください。"
    echo "   例: docker system prune -af --volumes"
    exit 1
  fi
}

ensure_builder() {
  if ! docker buildx inspect xbuilder >/dev/null 2>&1; then
    echo "🧱 buildx builder (xbuilder) を作成します..."
    docker buildx create --name xbuilder --use
  else
    docker buildx use xbuilder
  fi
}

pre_prune() {
  echo "🧹 事前クリーンアップ（buildx キャッシュ削除）..."
  docker buildx prune -af || true
}

post_prune() {
  echo "🧹 事後クリーンアップ（未使用のイメージ/ボリューム削除）..."
  docker system prune -af --volumes || true
}

show_df() {
  echo "📦 docker system df:"
  docker system df || true
}

# ==============================================================================
# 実行フロー
# ==============================================================================
echo "----------------------------------------------------"
echo "🚀 Cloud Run デプロイ開始（タグ: ${TAG}）"
echo "   プロジェクト: ${PROJECT_ID} / リージョン: ${REGION}"
echo "----------------------------------------------------"

need_space
ensure_builder
pre_prune
show_df

# Artifact Registry への Docker 認証
echo "🔑 Artifact Registry への Docker 認証設定中..."
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

# Artifact Registry リポジトリの存在確認・無ければ作成
if ! gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
  echo "📦 Artifact Registry リポジトリ (${REPO_NAME}) を作成します..."
  gcloud artifacts repositories create "${REPO_NAME}" \
    --repository-format=docker \
    --location="${REGION}" \
    --project="${PROJECT_ID}" \
    --description="Docker repository for ${SERVICE_NAME}"
fi

# Docker ビルド & Push
echo "🔁 Docker ビルド実行（linux/amd64, Artifact Registry にプッシュ）..."
docker buildx build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  --build-arg NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL}" \
  -t "${AR_URI}" \
  -t "${LATEST_URI}" \
  --provenance=false \
  --push \
  .

# Cloud Run へデプロイ
echo "☁️ Cloud Run へのデプロイ中..."
gcloud run deploy "${SERVICE_NAME}" \
  --image="${AR_URI}" \
  --project="${PROJECT_ID}" \
  --platform=managed \
  --region="${REGION}" \
  --allow-unauthenticated \
  --port="${PORT}" \
  --set-env-vars \
NODE_ENV="production",\
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}",\
STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}",\
STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET}",\
STRIPE_PRICE_ID="${STRIPE_PRICE_ID}"

post_prune
show_df

echo "----------------------------------------------------"
echo "✅ デプロイが正常に完了しました！"
echo "   イメージ: ${AR_URI}"
echo "----------------------------------------------------"