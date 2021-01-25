#!/usr/bin/env python
# coding: utf-8

# In[59]:


import pickle
import numpy as np
from imutils import paths, face_utils
import cv2
import dlib
import mediapipe as mp
from scipy.spatial.distance import euclidean as dist


# In[27]:


# !wget http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2
# !bunzip2 "shape_predictor_68_face_landmarks.dat.bz2"

TEMPLATE = np.float32([
    (0.0792396913815, 0.339223741112), (0.0829219487236, 0.456955367943),
    (0.0967927109165, 0.575648016728), (0.122141515615, 0.691921601066),
    (0.168687863544, 0.800341263616), (0.239789390707, 0.895732504778),
    (0.325662452515, 0.977068762493), (0.422318282013, 1.04329000149),
    (0.531777802068, 1.06080371126), (0.641296298053, 1.03981924107),
    (0.738105872266, 0.972268833998), (0.824444363295, 0.889624082279),
    (0.894792677532, 0.792494155836), (0.939395486253, 0.681546643421),
    (0.96111933829, 0.562238253072), (0.970579841181, 0.441758925744),
    (0.971193274221, 0.322118743967), (0.163846223133, 0.249151738053),
    (0.21780354657, 0.204255863861), (0.291299351124, 0.192367318323),
    (0.367460241458, 0.203582210627), (0.4392945113, 0.233135599851),
    (0.586445962425, 0.228141644834), (0.660152671635, 0.195923841854),
    (0.737466449096, 0.182360984545), (0.813236546239, 0.192828009114),
    (0.8707571886, 0.235293377042), (0.51534533827, 0.31863546193),
    (0.516221448289, 0.396200446263), (0.517118861835, 0.473797687758),
    (0.51816430343, 0.553157797772), (0.433701156035, 0.604054457668),
    (0.475501237769, 0.62076344024), (0.520712933176, 0.634268222208),
    (0.565874114041, 0.618796581487), (0.607054002672, 0.60157671656),
    (0.252418718401, 0.331052263829), (0.298663015648, 0.302646354002),
    (0.355749724218, 0.303020650651), (0.403718978315, 0.33867711083),
    (0.352507175597, 0.349987615384), (0.296791759886, 0.350478978225),
    (0.631326076346, 0.334136672344), (0.679073381078, 0.29645404267),
    (0.73597236153, 0.294721285802), (0.782865376271, 0.321305281656),
    (0.740312274764, 0.341849376713), (0.68499850091, 0.343734332172),
    (0.353167761422, 0.746189164237), (0.414587777921, 0.719053835073),
    (0.477677654595, 0.706835892494), (0.522732900812, 0.717092275768),
    (0.569832064287, 0.705414478982), (0.635195811927, 0.71565572516),
    (0.69951672331, 0.739419187253), (0.639447159575, 0.805236879972),
    (0.576410514055, 0.835436670169), (0.525398405766, 0.841706377792),
    (0.47641545769, 0.837505914975), (0.41379548902, 0.810045601727),
    (0.380084785646, 0.749979603086), (0.477955996282, 0.74513234612),
    (0.523389793327, 0.748924302636), (0.571057789237, 0.74332894691),
    (0.672409137852, 0.744177032192), (0.572539621444, 0.776609286626),
    (0.5240106503, 0.783370783245), (0.477561227414, 0.778476346951)])

TPL_MIN, TPL_MAX = np.min(TEMPLATE, axis=0), np.max(TEMPLATE, axis=0)
MINMAX_TEMPLATE = (TEMPLATE - TPL_MIN) / (TPL_MAX - TPL_MIN)

INNER_EYES_AND_BOTTOM_LIP = [39, 42, 57]
OUTER_EYES_AND_NOSE = [36, 45, 33]

landmarkIndices=OUTER_EYES_AND_NOSE = [36, 45, 33]

#npLandmarks = np.float32(landmarks)
npLandmarkIndices = np.array(landmarkIndices)

#npLandmarks[npLandmarkIndices]


MINMAX_TEMPLATE[npLandmarkIndices]
predictor_model = "shape_predictor_68_face_landmarks.dat"
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_model)
embedder = cv2.dnn.readNetFromTorch("./nn4.small2.v1.t7")


# In[28]:


def getLargestFaceBoundingBox(rgbImg):
        assert rgbImg is not None

        faces = faces = detector(rgbImg, 1)
        if (len(faces) > 0) or len(faces) == 1:
            return max(faces, key=lambda rect: rect.width() * rect.height())
        else:
            return None

def findLandmarks(rgbImg, bb):
        assert rgbImg is not None
        assert bb is not None

        points = predictor(rgbImg, bb)
        return list(map(lambda p: (p.x, p.y), points.parts()))

def align(imgDim, rgbImg, bb=None, landmarks=None, landmarkIndices=OUTER_EYES_AND_NOSE):
        assert imgDim is not None
        assert rgbImg is not None
        assert landmarkIndices is not None

        if bb is None:
            bb = getLargestFaceBoundingBox(rgbImg)
            if bb is None:
                return

        if landmarks is None:
            landmarks = findLandmarks(rgbImg, bb)

        npLandmarks = np.float32(landmarks)
        npLandmarkIndices = np.array(landmarkIndices)

        H = cv2.getAffineTransform(npLandmarks[npLandmarkIndices],
                                   imgDim * MINMAX_TEMPLATE[npLandmarkIndices])
        thumbnail = cv2.warpAffine(rgbImg, H, (imgDim, imgDim))

        return thumbnail
    
def most_common(npArray):
    return np.bincount(npArray).argmax()



def match(student_id:str, lecture:str, finger_count: int):
   
    lec = pickle.loads(open("./models/"+lecture+".pickle", "rb").read())
    clf = lec["model"]
    label = lec["label"]
    imagePaths = list(paths.list_images("./lectures/"+lecture+"/"+str(student_id)))
    if imagePaths == []:
        return False
    
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.5)
    
    face_result = list()
    hand_result = list()
    
    face_flag = True
    hand_flag = True
    
    frame_count = 0
    for path in imagePaths:
        if frame_count > 50:
            break
        frame_count += 1
        image = cv2.imread(path)
        image = cv2.resize(image, None, fx = 0.5, fy = 0.5)
        im_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        box = getLargestFaceBoundingBox(im_rgb)

        if box == None:
            continue
            
        height, width, channels = im_rgb.shape

        alignedFace = align(height, im_rgb, box,
                                landmarkIndices=OUTER_EYES_AND_NOSE)

        aligned = cv2.cvtColor(alignedFace, cv2.COLOR_RGB2BGR)
        faceBlob = cv2.dnn.blobFromImage(aligned, 1.0 / 255, (96, 96), (0, 0, 0), swapRB=True, crop=False)
        embedder.setInput(faceBlob)
        vec = embedder.forward()
        face_result.append(clf.predict(vec)[0])
        
        #hand gesture recognition
        if finger_count != "100":
            im_rgb.flags.writeable = False
            results = hands.process(im_rgb)

               # Draw the hand annotations on the image.
            im_rgb.flags.writeable = True

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    fingers = [0 for _ in range(5)]
                    marks = hand_landmarks.landmark
                    key = dict()
                    for i in range(21):
                        key[i] = [marks[i].x, marks[i].y]


                    if dist(key[17], key[3]) < dist(key[17], key[4]):
                        fingers[0] = 1
                    if dist(key[0], key[6]) < dist(key[0], key[8]):
                        fingers[1] = 1
                    if dist(key[0], key[10]) < dist(key[0], key[12]):
                        fingers[2] = 1
                    if dist(key[0], key[14]) < dist(key[0], key[16]):
                        fingers[3] = 1
                    if dist(key[0], key[18]) < dist(key[0], key[20]):
                        fingers[4] = 1

    #                 if fingers == [1, 1, 0, 0, 1]:
    #                     result = "peace"
    #                 elif fingers[2:] == [1, 1, 1] and dist(key[4], key[8]) < dist(key[4], key[3]):
    #                     result = "OK"     
    #                 else:
    #                     result = sum(fingers)
                    finger = sum(fingers)
    #                 print(fingers)
    #                 print(finger)

                    hand_result.append(finger)

        
              
    most_face = most_common(face_result)
    pred = str(label[most_face])
    if pred != student_id:
        face_flag = False
        
    most_hand = "999"
    if finger_count != "100":
#         print(hand_result)
        try:
            most_hand = most_common(hand_result)
            if str(most_hand) != finger_count:
                hand_flag = False
        except:
            hand_flag=  False
    print(face_flag, hand_flag)
    print(pred, most_hand)
    return face_flag, hand_flag

if __name__ == "__main__":
    pass
#     print(10000)
#     match(20001000, "1111", 100)
#     print(5649)
#     match(20185649, "1111", 100)
#     print(6830)
#     match(20186830, "1111", 100)
#     print(5130)
#     match(20185130, "1111", 100)
#     print(5649)
#     match(20185649, "2222", 5)
#     print(6830)
#     match(20186830, "2222", 5)
#     print(5130)
#     match(20185130, "2222", 3)


