---
title: "Brophy Attendance"
website: "https://batt.rgodha.com"
repo: "https://github.com/rgodha24/attendance"
blurb: a realtime and localfirst attendance system in use at Brophy College Preparatory
order: 30
tech:
 - sst
 - aws
 - shadcn/ui
 - react
 - electrodb
 - rust
---

# Brophy Attendance

This is a program used to track the attendance in the [Innovations Commons](https://www.brophyprep.org/academics/technology/innovation-commons) at Brophy College Preparatory. It has been used for thousands of `sign-ins` in dozens of classes, and it is still currently in use.

It has multiple parts:
- an aws lambda and aws dynamodb based backend running in us-west-1 that categorizes and updates the web client in real time
- a rust based cli program running on a raspberry pi connected to a barcode scanner that uploads all student sign-ins to the backend
- a web dashboard that connects to the aws backend via a (still serverless!) websocket, with controlled access to `sign-ins` happening on the teacher's account

There are multiple important security and design considerations, especially to make this a solution that could work in multiple classrooms with multiple teachers:
- Teachers must sign in on the barcode scanner, and they can only view `sign-ins` that occur while their account is set on the barcode scanner. This prevents a whole host of things, including bad actors remotely tracking students as they go about their days.
    - in fact, the primary key of a sign in is based on the teachers userid, so they can not even be retrieved by the code without a signed in user.
- Teachers can only sign up to view data if they have a registered Brophy Google email.
- Teachers can claim a room onto their account with a single barcode scan, creating a much easier usecase for teachers without a set room.
- Students just have to scan their barcode to do attendance.

I used this as a testbed for a few different technologies, but the main one was [sst](https://v2.sst.dev). 
I had never built anything deployed directly onto AWS, so this was a new and exciting experience for me. It also is "local first" in that the web dashboard downloads all signins to indexedb before displaying it. 

Here's a diagram explaining how everything works: ![Diagram showing Brophy Attendance Control Flow](https://private-user-images.githubusercontent.com/90421212/286378765-0715195d-ca11-4b4e-8176-5a791a8b791a.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjQ2MjM5NTQsIm5iZiI6MTcyNDYyMzY1NCwicGF0aCI6Ii85MDQyMTIxMi8yODYzNzg3NjUtMDcxNTE5NWQtY2ExMS00YjRlLTgxNzYtNWE3OTFhOGI3OTFhLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA4MjUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwODI1VDIyMDczNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWM2MWU3NDBkOGMwYjRmYzM5NmNhYTYzMjRiOGQ2ZDkyZGY3ODQ0ZjAyYzlmMmJiNDM1YmMzMTYzZjk1M2EzMzImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.YBeA6hzAvah-4FLIufvgm2MPOE8CX1SnKnX-EzVTw6c)
