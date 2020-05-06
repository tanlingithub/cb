
docker run  -v /Users/kun/work/poc/kabin/kabin-console:/usr/src/app --name kabin-console-poc kabin:console

docker rm -f kabin-console-poc


mv ./dist /root/poc/kabin/

# rm -fr /root/poc/kabin/console

mv /root/poc/kabin/dist /root/poc/kabin/console1