import crop
import matching
# import updateDB
import sys
import os
import pymongo
import dns
import time

#dir, key, week, gesture

def main():
    mng_client = pymongo.MongoClient("mongodb+srv://capstone:stonecap@cluster0.mqn35.mongodb.net/cluster0?retryWrites=true&w=majority")
    db = mng_client["data10"]
    db_ck = db["checks"]
    start = time.time()
    vid_dir, class_id, week, finger_count, class_name = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]

    crop.crop(vid_dir, class_id)
    Lap = time.time()
    print("after Crop: ", Lap - start)
    for student in os.listdir("./lectures/"+str(class_id)):
        face_match, finger_match = matching.match(student, class_id, finger_count)
        if face_match:
            face = "o"
        else:
            face = "x"
        if finger_match:
            finger = "o"
        else:
            finger = "x"
            
        #update the database to mark whether the person was present or not
        db_ck.insert({"key": class_id, "name" : class_name, "week" : week, "studentid":int(student), "face": face, "gesture" : finger})
        print(face_match, finger_match)
        print("student: ", time.time()- Lap)
        Lap = time.time()
    print("total : ", Lap - start)
    return "Success"

if __name__ == "__main__":
    main()
