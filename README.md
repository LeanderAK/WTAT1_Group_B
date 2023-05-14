# WTAT1_Group_B
Install MongoDB using
```
brew install mongodb
```
Start mongodb server in a new terminal with
``` 
mongod 
```
MongoDB creates a default data directy. If you wish tu use a different directory you can pass it as an argument when running ```mongod```

```
mongod --dbpath <PATH>
```
PATH EXAMPLE: /Users/leander/Desktop/Agile-Web/db

Start Mongodb on Mac: 

```
sudo mongod --dbpath /System/Volumes/Data/data/db
```

[Icon-Set](https://www.streamlinehq.com/icons/streamline-mini-line)

Run dummyData file by entering 
```
node dummyData.js
```
in terminal in each subsequent lesson to avoid having an empty or inconsistent database.
