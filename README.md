# backend, web-admin

## development
- ``cd tools && docker context use default``
- ``docker compose -p YOUR_PROJECT_NAME --env-file=.env.development up --build``

## production
- create .env.production in *backend/service-core/settings* folder
- create secret-production-ca-certificate.crt in *backend/service-core/settings* folder
- create .env.production in *frontend/web-admin/settings* folder
- create .env.production in *tools* folder
- ``cd tools && docker context use default``
- ``docker compose --env-file=.env.production -f docker-compose.production.yml build``
- ``docker login registry.digitalocean.com``
- ``docker compose --env-file=.env.production -f docker-compose.production.yml push``
-  create *YOUR_PROJECT_NAME-production* context, if not exists.
``docker context create YOUR_PROJECT_NAME-production --docker "host=ssh://root@165.22.55.180"``
- ``docker context use YOUR_PROJECT_NAME-production``
- ``docker secret create nats_creds ../backend/service-core/settings/secret-production-nats.creds``
- ``docker secret create mongo_ca_file ../backend/service-core/settings/secret-production-ca-certificate.crt``
- ``docker stack deploy --with-registry-auth -c <(sed -E '/env_file|.env.production/d' <(echo -e "version: '3.9'\n"; docker-compose --env-file=.env.production -f docker-compose.production.yml config)) YOUR_PROJECT_NAME-production``
- ``docker context use default``
