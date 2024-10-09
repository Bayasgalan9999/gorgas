FROM mongo

ARG MONGO_DB
ENV MONGO_DB=$MONGO_DB

COPY *.json ./

CMD mongoimport --host mongo --db ${MONGO_DB} --collection menus --type json --file ./menus.json --jsonArray && \
    mongoimport --host mongo --db ${MONGO_DB} --collection users --type json --file ./users.json --jsonArray && \
    mongoimport --host mongo --db ${MONGO_DB} --collection roles --type json --file ./roles.json --jsonArray && \
    while true; do sleep 100000; done