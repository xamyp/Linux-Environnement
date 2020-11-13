#!/bin/bash
pkill -f barrier
pkill -f scream
#barrier &
/home/max/Documents/scream/Receivers/unix/build/scream -u -p 4011 -i virbr1 &
/usr/bin/barrierc -f --no-tray --name pop-os --enable-crypto [192.168.101.239]:24800 &
virsh start win10
virsh attach-device win10 /home/max/vm/keyboard-usb.xml
virsh attach-device win10 /home/max/vm/mouse-usb.xml
xrandr --output HDMI-A-0 --off
