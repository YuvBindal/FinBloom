# FinBloom

A DeFi web application for microloans built using XPRL

## Run server

python -m uvicorn server:app --reload

## Test if its working

Make a GET request to http://127.0.0.1:8000/hello or simply open that url in browser.
Server should give back this response:

```
{"message":"yep, it's working"}
```

## Directory:

#### In /backend:

- Server code is in `server.py`. No need to change anything there.
- All routes go into `routes.py`. Make sure to import
- All models go into `/aiModels`. and should be called from there.
- For now all logic stuff is in relevant file in the `/backend` folder. Can change later
