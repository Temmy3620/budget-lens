# -------------------------------------------------------------
# Base Image
# -------------------------------------------------------------
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.15.1

# -------------------------------------------------------------
# Dependencies Stage
# -------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# -------------------------------------------------------------
# Builder Stage
# -------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js のクライアント側（ブラウザ）に埋め込む公開環境変数
# ※秘密鍵（SERVICE_ROLE_KEY や STRIPE_SECRET_KEY）はここには含めず、Cloud Run の実行時環境変数で設定します
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# テレメトリの無効化と本番ビルド
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm build

# -------------------------------------------------------------
# Runner Stage (Cloud Run 用)
# -------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Cloud Run はデフォルトで PORT=8080 を使用します
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# セキュリティ向上のため非 root ユーザーを作成して実行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 静的アセットおよびスタンドアロン出力をコピー
COPY --from=builder /app/public ./public

# standalone 出力と静的アセットをコピー
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
