@echo off
set NODE_OPTIONS=--max-old-space-size=4096
call pnpm install
call pnpm run build