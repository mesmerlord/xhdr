Server: 152.53.39.233
ssh root@152.53.39.233

deploy production.yml admakeai_frontend prisma_studio frontend_queue && \
 docker compose -f production.yml run --rm prisma_studio env $(cat .env.production | grep -v "#" | xargs) npm run db:deploy
