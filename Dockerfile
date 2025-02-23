# develop stage
FROM node:16-alpine as build-stage

ARG PROD
ARG DB_URL
ARG DB_PORT
ARG DB_USER
ARG DB_PASS
ARG CREATE_DB_URL

#13.14-alpine as develop-stage
COPY ./ /app
WORKDIR /app

RUN npm install -g @quasar/cli && \
    npm install -g @vue/cli && \
    npm install -g @vue/cli-init 

#COPY package*.json ./
#RUN yarn global add @quasar/cli
# COPY . .

# build stage
#FROM develop-stage as build-stage
RUN npm install
#RUN yarn
RUN quasar build -m pwa

# production stage
FROM nginx:1.17.5-alpine as production-stage

COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
#CMD ["quasar", "serve", "/app/dist/pwa", "--port", "80", "--hostname", "0.0.0.0"]
#CMD ["quasar", "dev", "--port", "80", "--hostname", "0.0.0.0", "-m", "pwa"]

