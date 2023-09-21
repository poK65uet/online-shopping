FROM node:latest
WORKDIR /app/customer
COPY package.json .
RUN npm install
EXPOSE 8001
CMD ["npm", "start"]
