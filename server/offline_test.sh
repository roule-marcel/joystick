#if [ -p /dev/motors ]; then echo "/dev/motors already exists... are you a robot ?"; exit 1; fi

sudo mkfifo /dev/motors
sudo mkfifo /dev/beep
sudo chmod a+wr /dev/motors
sudo chmod a+wr /dev/beep

cat /dev/beep &
cat /dev/motors

