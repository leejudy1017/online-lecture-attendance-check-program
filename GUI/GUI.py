#import modules
import tkinter
import tkinter as tk
import tkinter as ttk
from tkinter import *
from tkinter import PhotoImage
import os
import time
import pyautogui 
import cv2 
import numpy as np 
import keyboard
from os import system
import requests
import webbrowser
import json
import re
 
# Designing window for login 
 
def login():
    global login_screen
    login_screen = Toplevel(main_screen)
    login_screen.title("CAU capstone")
    login_screen.geometry("450x300")
    Label(login_screen, text="Login", bg="skyblue").pack()
    Label(login_screen, text="").pack()
 
    global username_verify
    global password_verify
 
    username_verify = StringVar()
    password_verify = StringVar()
 
    global username_login_entry
    global password_login_entry
 
    Label(login_screen, text="Email * ").pack()
    username_login_entry = Entry(login_screen, textvariable=username_verify)
    username_login_entry.pack()
    Label(login_screen, text="").pack()
    Label(login_screen, text="Password * ").pack()
    password_login_entry = Entry(login_screen, textvariable=password_verify, show= '*')
    password_login_entry.pack()
    Label(login_screen, text="").pack()
    Button(login_screen, text="OK", width=10, height=1, command = login_verify).pack()
    #Label(login_screen, text="").pack()
    global error
    error = Label(login_screen, text="")
    error.pack()


# Implementing event on login button 
def login_verify():
    global login
    global error
    body = {'email':username_verify.get(), 'password':password_verify.get()}
    url = "https://chul-check.tk/api/users/login"
    response = requests.post(url, data=body)
    #print(response)
    
    login = response.json()
    print(login)

    if  login["loginSuccess"] == True:
        error.configure(text="")
        select_class()
    elif login["loginSuccess"] == False :
        error.configure(text="try again",fg="green" )

def select_class():
    global class_screen
    global attendance_class
    global weeknum
    global weeknum_st
    weeknum_st = StringVar()
    attendance_class = StringVar()
    main_screen.withdraw()
    login_screen.withdraw()
    class_screen = Toplevel(main_screen)
    class_screen.geometry("450x300")
    class_screen.title("CAU capstone")

    Label(class_screen, text="Select class and weekend" ,bg="skyblue").pack()
    Label(class_screen,text="").pack()
    #api (DB)
    body = {'id':login["userId"]}
    url = "https://chul-check.tk/api/users/professor"
    response = requests.post(url, data=body)
    info = response.json()
    #print(info)

    body2 = {'name':info["info"]["name"], 'major':info["info"]["major"]}
    url2 = "https://chul-check.tk/api/datas/professor/courses"
    response2 = requests.post(url2, data=body2)
    courses = response2.json()
    course_list = []
    global detail_list
    detail_list = courses["courseList"]
    #print(detail_list)

    for course in courses["courseList"]:
        course_list.append(course['course']+"  "+course['class'])

    attendance_class.set(course_list[0])
    opt = OptionMenu(class_screen, attendance_class, *course_list )
    opt.config(width=35)
    opt.pack()
    Label(class_screen,text="").pack()

    week_list = []
    for i in range(1,16):
        week_list.append(str(i)+" 주차")
    weeknum_st.set(week_list[0])
    opt2 = OptionMenu(class_screen, weeknum_st, *week_list )
    opt2.config(width=6)
    opt2.pack()

    Label(class_screen,text="").pack()
    Button(class_screen, text="OK", width=10, height=1, command=menu).pack()

def menu():
    global weeknum
    weeknum = int(weeknum_st.get().split(' ')[0])
    global class_name
    global class_num
    global key
    class_num = attendance_class.get().split('  ')[1]
    class_name = attendance_class.get().split('  ')[0]
    print(class_num)

    for i in detail_list:
        if(i['class']==class_num):
            key = (i['key'])
    
    global menu_screen
    global checkver
    checkver = 2 #manual
    menu_screen = Toplevel(main_screen)
    class_screen.withdraw()
    menu_screen.geometry("450x300")
    menu_screen.title("CAU capstone")

    Label(menu_screen, text="Attendence check", bg="skyblue").pack()
    Label(menu_screen,text="").pack()
    Button(menu_screen,text="Automatic check", height="2", width="30", command = gesturecheck).pack()
    Label(menu_screen,text="").pack()
    Button(menu_screen,text="Manual check", height="2", width="30", command = screenrecording).pack()

def gesturecheck():
    global checkver
    checkver = 1 #auto
    global gesture_screen
    gesture_screen = Toplevel(main_screen)
    menu_screen.withdraw()
    gesture_screen.geometry("450x300")
    gesture_screen.title("CAU capstone")
    global choice
    choice = IntVar()
    # choice = 1 : gesture o , choice = 2 : gesture x

    Label(gesture_screen,text="").pack()
    Label(gesture_screen, text="(select) Do you want to check Gesture?").pack()
    Label(gesture_screen,text="").pack()
    Radiobutton(gesture_screen,text='yes', padx=20, variable=choice,value=1).pack(anchor=W)
    Radiobutton(gesture_screen,text='no', padx=20, variable=choice,value=2).pack(anchor=W)
    btn = Button(gesture_screen, text="OK", width=10, height=1, command=button_click)
    btn.pack()

def button_click():
    if choice.get()==1:
        gesture_select()
    if choice.get()==2:
        screenrecording()

def gesture_select():
    global gestureselect_screen
    global finger_count
    # if finger_count == 100, not use gesture 
    finger_count = StringVar()
    gestureselect_screen = Toplevel(main_screen)
    gesture_screen.withdraw()
    gestureselect_screen.geometry("450x300")
    gestureselect_screen.title("CAU capstone")
    Label(gestureselect_screen,text="").pack()
    Label(gestureselect_screen, text="Select the number of fingers to check gestures").pack()
    Label(gestureselect_screen,text="").pack()

    finger_list = []
    for i in range(0,6):
        finger_list.append(str(i))
    finger_count.set(finger_list[0])
    opt3 = OptionMenu(gestureselect_screen, finger_count, *finger_list )
    opt3.config(width=6)
    opt3.pack()

    Label(gestureselect_screen,text="").pack()
    Button(gestureselect_screen, text="OK", width=10, height=1, command=screenrecording).pack()

def screenrecording():
    global screenrecording_screen
    screenrecording_screen = Toplevel(main_screen)
    global finger
    
    if finger_count == 100:
        finger = 100
    else :
        finger = int(finger_count.get())

    print(class_name)
    print(key)
    print(finger)
    print(weeknum)

    if checkver == 1: #auto
        if choice.get()==1:
            gestureselect_screen.withdraw()
        elif choice.get()==2:
            gesture_screen.withdraw()
    elif checkver ==2: #manual
        menu_screen.withdraw()

    screenrecording_screen.geometry("450x350")
    screenrecording_screen.title("CAU capstone")
    Label(screenrecording_screen, text="NOTICE", bg="skyblue", width="300", height="2", font=("Calibri", 13)).pack()
    Label(screenrecording_screen,text="").pack()
    Label(screenrecording_screen, text="Now we're recording the screen!").pack()
    Label(screenrecording_screen, text="( Press 'q' if you want to stop recording )").pack()
    Label(screenrecording_screen,text="").pack()
    Label(screenrecording_screen, text="* For accurate attendance check,").pack()
    Label(screenrecording_screen, text="do not move the screen when recording the screen").pack()
    Label(screenrecording_screen, text="(approximately 10 seconds)").pack()
    Label(screenrecording_screen,text="").pack()
    Button(screenrecording_screen, text="START", width=10, height=1, command=recording).pack()

def recording():
    global screenrecording

    screenrecording_screen.withdraw()
    resolution = (1920, 1080) 
    codec = cv2.VideoWriter_fourcc(*"XVID") 

    #filename sever path 
    filename = str(key)+".avi"
    fps = 60.0
    out = cv2.VideoWriter(filename, codec, fps, resolution) 

    while True:  
        img = pyautogui.screenshot() 
        frame = np.array(img) 
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) 
        out.write(frame) 
        # stop recording when we press 'q' 
        if keyboard.is_pressed('q'): 
            break
                
    #key.avi , body: key, gesture, weeknum
    files = open(str(key)+'.avi','rb')
    upload = {'file':files}
    obj = {"name": class_name ,"key": 3333, "finger": finger, "week": weeknum}
    res = requests.post("https://chul-check.tk/api/datas/verify",files =upload, data=obj)
    print(res)
    print(res.json)

    global auto
    auto = res.json()

    global student
    student = []
    
    for i in range(len(auto["result"])):
        student.append(auto["result"][i].split('|')[0])

    out.release() 
    files.close()
    os.remove(str(key)+'.avi')
    cv2.destroyAllWindows()

    if checkver ==1: #auto
        confirm()
    elif checkver ==2: #manual
        check()

#auto
def confirm():
    global confirm_screen
    confirm_screen = Toplevel(main_screen)
   
    confirm_screen.geometry("450x350")
    confirm_screen.title("CAU capstone")
    Label(confirm_screen, text="Confirm Automatic attendence !", bg="skyblue", width="300", height="2", font=("Calibri", 13)).pack()
    Label(confirm_screen,text="").pack()

    global auto
    for i in range(len(auto["result"])):
        Label(confirm_screen,text=auto["result"][i]).pack()

    Label(confirm_screen,text="").pack()
    Button(confirm_screen,text="ok", height="2", width="10", command = finish).pack()
    Label(confirm_screen,text="").pack()

def clickNext():
    global student_num
    #global text
    global num1
    global pLabel1
    global fnameList1
    global num2
    global pLabel2
    global fnameList2
    global button1
    global button2

    button1.configure(state=NORMAL)
    button2.configure(state=NORMAL)  

    num1 +=1
    num2 +=1
    if num1>len(fnameList1)-1:
        num1=0
        num2=0
    photo1 = PhotoImage(file = fnameList1[num1])
    pLabel1.configure(image = photo1)
    pLabel1.image1 = photo1
    photo2 = PhotoImage(file = fnameList2[num2])
    pLabel2.configure(image = photo2)
    pLabel2.image2 = photo2
    num.configure(text =student_num[num1])

    if student_check[num1] == None:
        button1.configure(bg="white")
        button2.configure(bg="white")
    elif student_check[num1] == "o":
        button1.configure(bg="green")
        button2.configure(bg="white")
    elif student_check[num1] == "x":
        button2.configure(bg="green")
        button1.configure(bg="white")
    
    global button
    for i in range(len(fnameList1)):
        if student_check[i] == None:
            break
        else:
            button.configure(state=NORMAL)

def clickPrev():
    global student_num
    #global text
    global num1
    global pLabel1
    global fnameList1
    global num2
    global pLabel2
    global fnameList2
    global button1
    global button2

    button1.configure(state=NORMAL)
    button2.configure(state=NORMAL)

    num1 -=1
    num2 -=1
    if num1 <0:
        num1 = len(fnameList1)-1
        num2 = len(fnameList1)-1
    photo1 = PhotoImage(file = fnameList1[num1])
    pLabel1.configure(image = photo1)
    pLabel1.image1 = photo1
    photo2 = PhotoImage(file = fnameList2[num2])
    pLabel2.configure(image = photo2)
    pLabel2.image2 = photo2
    num.configure(text =student_num[num1])

    if student_check[num1] == None:
        button1.configure(bg="white")
        button2.configure(bg="white")
    elif student_check[num1] == "o":
        button1.configure(bg="green")
        button2.configure(bg="white")
    elif student_check[num1] == "x":
        button2.configure(bg="green")
        button1.configure(bg="white")
    
    global button
    for i in range(len(fnameList1)):
        if student_check[i] == None:
            break
        else:
            button.configure(state=NORMAL)

def check():
    global check_screen
    global pLabel1
    global fnameList1
    global photoList1
    global num1
    #global text

    global pLabel2
    global fnameList2
    global photoList2
    global num2
    global student_num
    student_num = []

    global student
    fnameList1 = []*len(student)
    fnameList2 = []*len(student)

    for i in len(student):
        fnameList1[i] = f"https://chul-check.tk/uploads/card/{student[i]}.png"
        fnameList2[i] = f"https://chul-check.tk/uploads/check/{key}_{student[i]}.png"

    photoList1 = [None]*len(fnameList1)
    num1=0
    photoList2 = [None]*len(fnameList2)
    num2=0
    attendence = [None]*len(fnameList2)

    for i in range(len(fnameList1)):
        student_num.append(fnameList1[i].split('.')[0])

    #chul-check (o/x)
    global student_check
    student_check = [None]*len(fnameList1)

    check_screen = Toplevel(main_screen)
    check_screen.geometry("700x500")
    check_screen.title("CAU capstone")
    Label(check_screen, text=" "+class_name+"  [ "+str(weeknum)+" 주차 ] ", bg="skyblue").pack()
    Label(check_screen,text="").pack()
    Label(check_screen, text="Confirm Manual attendence !").pack()
    Label(check_screen,text="").pack()

    btnPrev = Button(check_screen, text="<<", command=clickPrev)
    btnNext = Button(check_screen, text=">>", command=clickNext)
    check_screen.bind("Up", clickNext)
    check_screen.bind("Down",clickPrev)

    photo1 = PhotoImage(file=fnameList1[num1])
    pLabel1 =Label(check_screen,image = photo1, width="250", height="250" )
    photo2 = PhotoImage(file=fnameList2[num2])
    pLabel2 =Label(check_screen,image = photo2, width="250", height="250" )

    btnPrev.place(x=30,y=200)
    btnNext.place(x=630,y=200)
    pLabel1.place(x=85,y=100)
    pLabel2.place(x=360,y=100)
    
    global num
    num = Label(check_screen, text="<< press the button >>", width ="20", height="1")
    num.place(x=260,y=380)

    global button1
    global button2
    button1 = Button(check_screen, text="승인", height="1", width="5",command = chul,bg="white",state=DISABLED)
    button2 = Button(check_screen, text="미승인", height="1", width="5", command = nochul,bg="white",state=DISABLED)
    button1.place(x=270, y=430)
    button2.place(x=370, y=430)
    
    global button
    button = Button(check_screen, text="confirm", height="1", width="6",bg="gray",fg="white",command=finish,state=DISABLED)
    button.place(x=620, y=430)


def chul():
    global button1
    global button2
    button1.configure(bg="green")
    button2.configure(bg="white")
    global student_check
    student_check[num1] ="o"

def nochul():
    global button1
    global button2
    button2.configure(bg="green")
    button1.configure(bg="white")
    global student_check
    student_check[num1] ="x"

def finish():

    if checkver == 2:
        global students
        students = [None]*len(fnameList1)
        for i in range(len(fnameList1)):
            manual_check = {"key":key,"class":class_name,"number":student_num[i],"weeknum":weeknum,"check":student_check[i]}
            students[i]=manual_check
        print(students)

    global finish_screen
    finish_screen = Toplevel(main_screen)
    if checkver ==1:
        confirm_screen.withdraw()
    elif checkver ==2:
        check_screen.withdraw()
    finish_screen.geometry("450x350")
    finish_screen.title("CAU capstone")
    Label(finish_screen, text="<CAU group 8>", bg="skyblue").pack()
    Label(finish_screen,text="").pack()
    Label(finish_screen, text="Attendence check is OVER !", width="300", height="2").pack()
    Label(finish_screen,text="").pack()
    Label(finish_screen, text="Thanks you for using our program", width="300", height="1").pack()
    Label(finish_screen,text="").pack()
    Button(finish_screen,text="EXIT", height="1", width="10", command = exit).pack()
    Label(finish_screen,text="").pack()

def exit():
    sys.exit()
    
def callback(url):
    webbrowser.open_new(url)

# Designing Main(first) window
def main_account_screen():
    global main_screen
    main_screen = Tk()
    main_screen.geometry("450x300")
    main_screen.title("CAU capstone")
    Label(text="Welcome to check Attendence program!", bg="skyblue", width="300", height="2", font=("Calibri", 13)).pack()
    Label(text="").pack()
    Button(text="Login", height="2", width="30", command = login).pack()
    Label(text="").pack()
    link = Button(text="join", height="2", width="30")
    link.pack()
    link.bind("<Button-1>",lambda e: callback("https://chul-check.tk/register/professor"))
    main_screen.mainloop()


finger_count =100
main_account_screen()
