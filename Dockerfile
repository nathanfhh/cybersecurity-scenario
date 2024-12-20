FROM node:20-alpine AS builder
ARG FRONTEND_BUILD_ENVIRONMENT

ENV PROJECT_NAME=CSTT
WORKDIR /root/$PROJECT_NAME
ADD . /root/$PROJECT_NAME
RUN npm install && npm run build


FROM nginx:1.27-alpine
ENV PROJECT_NAME=CSTT
COPY --from=builder /root/$PROJECT_NAME/dist /usr/share/nginx/html