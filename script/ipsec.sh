#!/bin/bash
ip addr show dev eno1 | grep "inet[^6]" | awk '{print $2}' | grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b"
