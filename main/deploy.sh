rm -rf .idea/

REGION=asia-east1
gcloud functions deploy random-cat \
    --gen2 \
    --memory 16GiB \
    --region ${REGION} \
    --runtime nodejs18 \
    --entry-point fetchRandomCat \
    --source . \
    --trigger-http \
    --allow-unauthenticated \
    --timeout 300s \
    --set-secrets "SLACK_SIGNING_SECRET_RANDOM_CAT=SLACK_SIGNING_SECRET_RANDOM_CAT:latest"

REPOSITORY=gcf-artifacts
PACKAGE=random--cat
for VERSION in $(gcloud artifacts versions list --repository=${REPOSITORY} --location=${REGION} --package=${PACKAGE} --format='value(name)'); do
    gcloud artifacts versions delete ${VERSION} --quiet --repository=${REPOSITORY} --location=${REGION} --package=${PACKAGE}
done
