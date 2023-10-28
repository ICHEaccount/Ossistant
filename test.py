import os, sys

print(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
print(sys.path)