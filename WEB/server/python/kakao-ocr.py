import json
import dlib
import cv2
import requests
import sys
import re
LIMIT_PX = 1024
LIMIT_BYTE = 1024*1024  # 1MB
LIMIT_BOX = 40


def kakao_ocr_resize(image_path: str):
    """
    ocr detect/recognize api helper
    ocr api의 제약사항이 넘어서는 이미지는 요청 이전에 전처리가 필요.

    pixel 제약사항 초과: resize
    용량 제약사항 초과  : 다른 포맷으로 압축, 이미지 분할 등의 처리 필요. (예제에서 제공하지 않음)

    :param image_path: 이미지파일 경로
    :return:
    """
    image = cv2.imread(image_path)
    height, width, _ = image.shape

    if LIMIT_PX < height or LIMIT_PX < width:
        ratio = float(LIMIT_PX) / max(height, width)
        image = cv2.resize(image, None, fx=ratio, fy=ratio)
        height, width, _ = height, width, _ = image.shape

        # api 사용전에 이미지가 resize된 경우, recognize시 resize된 결과를 사용해야함.
        image_path = "{}".format(image_path)
        cv2.imwrite(image_path, image)
        crop(image_path)
        return image_path
    return None

def kakao_ocr(image_path: str, appkey: str):
    """
    OCR api request example
    :param image_path: 이미지파일 경로
    :param appkey: 카카오 앱 REST API 키
    """
    API_URL = 'https://dapi.kakao.com/v2/vision/text/ocr'

    headers = {'Authorization': 'KakaoAK {}'.format(appkey)}

    image = cv2.imread(image_path)
    jpeg_image = cv2.imencode(".jpg", image)[1]
    data = jpeg_image.tobytes()

    return requests.post(API_URL, headers=headers, files={"image": data})

def crop(image_path):
    '''Test the given model by showing the detected landmarks.
        - image_path: the path of an image. Should contain a face.
        - model_path: the path of a shape predictor model.
    '''
    image = cv2.imread(image_path)
    face_detector = dlib.get_frontal_face_detector()
    dets = face_detector(image, 1)
    height, width, _ = image.shape
    top, bottom, left, right = dets[0].top()-40, dets[0].bottom()+40, \
                            dets[0].left()-50, dets[0].right()+50
    if top<=0:
        top = 0
    if bottom >= height:
        bottom = height
    if left <= 0:
        left = 0
    if right >= width:
        right = width
    image = image[top: bottom, left:right]
    cv2.imwrite(f"{image_path.split('.')[0]}-crop.png", image)


def main():
    if len(sys.argv) != 3:
        print("Please run with args: $ python example.py /path/to/image appkey")
    image_path, appkey = sys.argv[1], sys.argv[2]

    resize_impath = kakao_ocr_resize(image_path)
    if resize_impath is not None:
        image_path = resize_impath

    output = kakao_ocr(image_path, appkey).json()
    text =''
    for item in output['result']:
        if re.compile('\d{8}').search(''.join(item['recognition_words'][0].split())):
            text = item['recognition_words'][0]
    print(text)
    return text


if __name__ == "__main__":
    main()
