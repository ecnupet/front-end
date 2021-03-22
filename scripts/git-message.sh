#!/bin/bash
chmod +x ./scripts/python/message.py
git log -1 HEAD --pretty=format:'%cN 刚刚推送了更改：%n%n%s%n%nCommit Hash:%H' | ./scripts/python/message.py