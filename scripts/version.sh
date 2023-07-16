#!/usr/bin/env bash
while getopts u:a:f: flag
do
    case "${flag}" in
        f) dir=${OPTARG};;
    esac
done

arg=$1
version=($(echo ${arg:=patch}))
cwd=($(pwd))
current_dir="${cwd}/projects/ngx-config"

echo $current_dir
cd "$current_dir" && npm version $version
