FROM node:alpine as builder

WORKDIR /usr/app
COPY ./package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN rm -rf ./node_modules
RUN npm ci --omit=dev

FROM node:alpine as run 

WORKDIR /usr/app
COPY --from=builder /usr/app/dist /usr/app/dist
COPY --from=builder /usr/app/package.json /usr/app/package.json
COPY --from=builder /usr/app/node_modules /usr/app/node_modules
COPY --from=builder /usr/app/terraform /usr/app/terraform


# Mise à jour et installation des dépendances
RUN apk update && apk add --no-cache wget unzip

# Téléchargez Terraform depuis le site officiel
RUN wget https://releases.hashicorp.com/terraform/1.0.5/terraform_1.0.5_linux_amd64.zip

# Décompressez Terraform et placez-le dans le répertoire /usr/local/bin/
RUN unzip terraform_1.0.5_linux_amd64.zip -d /usr/local/bin/

# Supprimez le fichier ZIP téléchargé
RUN rm terraform_1.0.5_linux_amd64.zip


CMD ["npm", "start"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]
