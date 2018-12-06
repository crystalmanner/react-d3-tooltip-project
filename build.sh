#!/bin/bash

check_exit_code() {
    if [ $1 != 0 ]; then
        exit 1;
    fi
}

yarn install
check_exit_code $?

yarn build-storybook
check_exit_code $?

docker build --rm -t resoptima/styleguide:latest .
check_exit_code $?
