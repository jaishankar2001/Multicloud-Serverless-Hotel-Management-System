# pull official base image
FROM node:13.12.0-alpine
 
# set working directory
WORKDIR /frontend
 
# add `/app/node_modules/.bin` to $PATH
ENV PATH /fronend/node_modules/.bin:$PATH
 
# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
 
# add app
COPY . ./
 
# Expose the port the app runs on
EXPOSE 3000
 
# Define the environment variable for the port
ENV PORT 3000
 
# start app
CMD ["npm", "start"]