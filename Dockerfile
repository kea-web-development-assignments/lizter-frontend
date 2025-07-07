FROM node:22.14-alpine
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN npm ci
RUN npm run build
EXPOSE 5173
CMD ["node", "./dist/server/entry.mjs"]
