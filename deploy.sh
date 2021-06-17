yarn build
cd ../dist && rm -rf ./css ./favicon.ico ./img ./index.html ./js && mv ../frontend/dist/* ./ && git add . && git commit -m "deploy" && git push
