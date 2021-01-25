#!/usr/bin/env python
# coding: utf-8

# In[111]:


import pymongo
import dns
from videoEmbedding import embedding
from createModel_server import createModel
mng_client = pymongo.MongoClient("mongodb+srv://capstone:stonecap@cluster0.mqn35.mongodb.net/cluster0?retryWrites=true&w=majority")
db = mng_client['data10']
collection_name = 'courses'
db_cn = db[collection_name]
db_em = db["embeddings"]
db_usr = db["users"]


# In[112]:


def main():
    on = {"update" : 1} 
    off = { "$set" : {"update" : 0}}
    #check for modified student informations
    stdt = list(db_usr.find(flag))
    db_usr.update_many(on, off)
    need_update = []
    for s in stdt: #each student
        for courses in s["course"]: #each student's couses
            cid = courses["key"]
            need_upate.append(cid)
            db_cn.update_one({"key": cid}, {"$set" : {"update" : 1}})
    
    for s in stdt:
        student_id = s["studentId"]
        directory = s["video"]
        result = embedding(student_id, directory)
    
    s_list = []
    for cid in need_update:
        s_list = list(db_cn.find({"key": 3}))[0]["students"]
        createModel(s_list)
        
        
        
        
    
        


# In[94]:


if __name__ == "__main__":
    main()

