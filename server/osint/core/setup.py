#!/usr/bin/env python3

import os
import subprocess
import json 

# print("Current working directory:", os.getcwd())

with open('./core/tools.json','r') as jfile:
    data = json.load(jfile)

domain_data = data["domain"]


def clone_tool(data):
    git_path = os.path.join("./tools/lib",data["name"])
    if not os.path.exists(git_path):
        subprocess.run(["git", "clone", data["github"], git_path])
        print(f"{git_path} : Installation Complete")
    else:
        print(f"{git_path} : Exist")


def setup_tool():
    for key, value in domain_data.items():
        if isinstance(value,dict):
            clone_tool(domain_data[key])

        else:
            print("Please check tools.json")
