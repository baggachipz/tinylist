# develop stage
FROM node:13.14-alpine as develop-stage
COPY ./ /app
WORKDIR /app
#COPY package*.json ./
RUN yarn global add @quasar/cli
# COPY . .

# build stage
FROM develop-stage as build-stage
RUN npm install
RUN yarn
RUN quasar build -m pwa

# production stage
FROM nginx:1.17.5-alpine as production-stage
COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html
#COPY /app/dist/pwa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
#CMD ["quasar", "serve", "/app/dist/pwa", "--port", "80", "--hostname", "0.0.0.0"]
