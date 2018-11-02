FROM node:alpine
# pull a node image from docker hub

WORKDIR /app 
# set the working dir to /app

COPY package.json package.json 
COPY package-lock.json package-lock.json
# copy package.json to the container

RUN npm install 
#  install package.json modules in container

COPY . . 
# copy everything to container /app

# RUN npm install -g nodemon 
#  install nodemon for changes on the fly

# CMD [ "nodemon", "index.js" ] 
CMD npm start
#  start server inside container

EXPOSE 8087
# expose port 8087 to mount it to another port in local machine 
