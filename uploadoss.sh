#! bin/sh

wget https://devtools.qiniu.com/qshell-v2.4.3-linux-amd64.tar.gz
tar -zxvf qshell-v2.4.3-linux-amd64.tar.gz
./qshell account $AK $SK 单超
./qshell listbucket frontendecnupet
./qshell listbucket frontendecnupet | awk '{print $1}' > list.txt
./qshell batchdelete --force frontendecnupet -i list.txt
ls -al
./qshell qupload2 --src-dir=build --bucket=frontendecnupet

#cdn 刷新
wget https://cdn.ecnu.space/cdnflush
./cdnflush