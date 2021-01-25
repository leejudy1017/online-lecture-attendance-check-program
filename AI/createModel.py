#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import numpy as np
import pickle
from sklearn.svm import SVC
import sys
import pymongo


# In[27]:


def createModel(student_list:list):
    X = []
    Y = []
    label = 0
    label_dict = {}
    for id in student_list:
        data = pickle.loads(open("./students/" + str(id)+".pickle", "rb").read())
        X += data
        Y += [label for _ in data]
        label_dict[label] = id
        label += 1

    clf = SVC(C=1, kernel='linear', probability=True)
    clf.fit(X, Y)
    
    return clf, label_dict


# In[ ]:


# def main():
#     if len(sys.argv) != 2:
#         print("Please run with args: $ python createModel_server.py class_key")
#     class_key = sys.argv[1]
#     clf, label = createModel(class_key)
#     data = {"model" : clf, "label" : label}
#     f = open("./lecture/"+class_key+".pickle", "wb")
#     f.write(pickle.dumps(result))
#     f.close()
#     return True


# In[ ]:


if __name__ == "__main__":
#     main()
    clf, label = createModel(["20185649", 20186830, 20185130])
    f = open("./models/3333.pickle", "wb")
    data = {"model":clf, "label" : label}
    f.write(pickle.dumps(data))
    f.close()

