#inal detect : dlib_facedetext + rectangle + textdetect
import sys
import cv2
import dlib
import os
import re
import io
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]= "./My Project-eab2879c2449.json"

#from google.cloud import storage
from google.cloud import vision
#from google.protobuf import json_format
from google.cloud.vision import ImageAnnotatorClient
client = ImageAnnotatorClient()


'''
detect_text 
- Input : Image file path
- Output : List containing all detected text on the image
Google Vision API detects text from upper-left to lower-right.
Basically, Return type is JSON. 
It has text box coordinate of upper left corner with height and width.
But this function only returns the text in turn.
'''
def detect_text(path):
    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content) 

    response = client.text_detection(image=image)
    texts = response.text_annotations
    
    text_list = {}
    # print('frame', texts)
    for text in texts[1:]:
        des = text.description
        vertex = text.bounding_poly.vertices
        regex = re.compile("20\d{6}") 
        d = regex.search(des)
        if d != None:
            txt = d.group()
            text_list[txt] = list((v.x, v.y) for v in vertex)
            # print(text_list)

    # print(text_list)
    return text_list


def crop(video_path, class_name):
    myvideo =  cv2.VideoCapture(video_path)
    
    call_count = 0
    while True:
        ret , frame = myvideo.read()
        s_list = list()

        if ret:
            height, width, _ = frame.shape
            minW = width//7
            minH = height//7
            cv2.imwrite('./temp.jpg', frame)
            text_list = detect_text('./temp.jpg')
            key_list = list(text_list.keys())
            val_list = list(text_list.values())
            
            corner = [val[3] for val in val_list]
    
#             dx = corner[1][0] - corner[0][0]
            
            

            yVal = sorted(corner, key = lambda k : k[1])
            dy = minH
            for c in yVal[1:]:
#                 print("dy : ",c[1], yVal[0][1])
                if c[1] - yVal[0][1]  >= minH:
                    dy =  c[1] - yVal[0][1]
                    break
            
            
            xVal = sorted(corner, key = lambda k : k[0])
            dx = int(dy * 1.8) 
            for c in xVal[1:]:
                # print("dx : ",c[0], xVal[0][0], "dy : ", dy)
                if c[0] - xVal[0][0]  >= dx:
                    dx =  c[0] - xVal[0][0]
                    # print(dx)
                    break
                    
            if call_count > 50:
                for key in key_list:
                    if key not in s_list:
                        s_list.append(key)
                    if not os.path.exists("/home/ubuntu/check/"+class_name):
                        os.makedirs('/home/ubuntu/check/'+class_name)
                    xy = text_list[key][3]
                    startX, endX = xy[0] - 5, xy[0] + dx - 5
                    startY, endY = xy[1] -dy + 10, xy[1] + 10
                    if startX < 0: startX = 5
                    if endX > width: endX = width - 5
                    if startY < 0: startY = 5
                    if endY > height: endY = height - 5

    #                 print(startY, endY, startX, endX)
                    face = frame[startY : endY, startX : endX]
                    face = cv2.resize(face, dsize = (250,250))
                    cv2.imwrite("/home/ubuntu/check/"+class_name+ '/' + key +".png", face)
                break
                
            for key in key_list:
                if key not in s_list:
                    s_list.append(key)
                if not os.path.exists('./lectures/'+class_name +'/'+ key):
                    os.makedirs('./lectures/'+class_name + '/' + key)
                xy = text_list[key][3]
                startX, endX = xy[0] - 5, xy[0] + dx - 5
                startY, endY = xy[1] -dy + 10, xy[1] + 10
                if startX < 0: startX = 5
                if endX > width: endX = width - 5
                if startY < 0: startY = 5
                if endY > height: endY = height - 5
                
#                 print(startY, endY, startX, endX)
                face = frame[startY : endY, startX : endX]
                cv2.imwrite("./lectures/"+class_name+ '/' + key+ '/' + key+'_{}.png'.format(call_count),face)
            call_count += 1

            if os.path.exists('temp.jpg'):
                os.remove('temp.jpg')
            if  os.path.exists('temp.jpg_resized.jpg'):
                os.remove('temp.jpg_resized.jpg')
            
        else:
            break

    #os.remove('temp.avi')
    myvideo.release()
    cv2.destroyAllWindows()
    
    return True
            
        
if __name__ == "__main__":
#     crop("./2222_5.mp4")
    pass

