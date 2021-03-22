#!/bin/bash
chmod +x ./scripts/python/message.py
git log -1 HEAD --pretty=format:'front-end仓库主分支已更新，提交信息：%n%n%s%n%nAuthor: %cN%n%nEmail:%ce%n%nCommit Hash:%H' | ./scripts/python/message.py