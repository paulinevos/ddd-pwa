# pull base image
FROM node:23.5-bullseye-slim

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --unsafe-perm --allow-root -g npm@latest expo-cli@latest

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/ddd-pwa
WORKDIR /opt/ddd-pwa

# copy in our source code last, as it changes the most
WORKDIR /opt/ddd-pwa
# for development, we bind mount volumes; comment out for production

COPY ./ .

ENTRYPOINT ["npm", "run"]
CMD ["web"]