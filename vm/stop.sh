#!/bin/bash
virsh detach-device win10 /home/max/vm/keyboard-usb.xml
virsh detach-device win10 /home/max/vm/mouse-usb.xml
sleep 5
virsh shutdown win10
xrandr --output HDMI-A-0 --pos -1920x0 --mode 1920x1080 --rate 60
pkill -f barrier
pkill -f scream
