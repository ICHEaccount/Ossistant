#!/usr/bin/env python3

import os
import subprocess
import json 

with open('./tools.json','r') as jfile:
    data = json.load(jfile)

domain_data = data["domain"]

def clone_tool(data):
    git_path = os.path.join("./tool",data["name"])
    if not os.path.exists(git_path):
        subprocess.run(["git", "clone", data["github"], git_path])
        print(f"{git_path} : Installation Complete")
    else:
        print(f"{git_path} : Exist")

def setup():
    for key, value in domain_data.items():
        if isinstance(value,dict):
            clone_tool(domain_data[key])

        else:
            print("Please check tools.json")


        